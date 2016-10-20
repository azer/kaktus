const suggest = require("debounce-fn")(_suggest)
const http = electronRequire('http')

const searchDB = require("../../search")
const input = require("../../input")
const urls = require("../../urls")

const SUGGESTION_LIMIT = 5

module.exports = {
  open,
  quit,
  up,
  down,
  suggest,
  addResults,
  search: _search,
  selectInput: input.select.bind(null, 'url')
}

function open (payload, state, send, done) {
  send('search:setQuery', payload && payload.query || '', done)
  send('search:setPreview', payload && payload.preview || null, done)
  send('search:setResults', payload && payload.results || [], done)
  send('search:setAsOpen', done)
  send('findInPage:disable', done)

  if (payload && payload.results && payload.results.length > 0) {
    send('likes:recoverFromSearch', payload.results, done)
    send('domains:recoverFromSearch', payload.results, done)
  }

  if (payload && payload.select) {
    input.select('url')
  } else {
    input.focus('url')
  }

  if (payload && payload.query !== undefined) {
    _search(payload, state, send, done)
  }
}

function quit (payload, state, send, done) {
  if (!state.isOpen) return
  send('search:setAsClosed', done)
}


function up (payload, state, send, done) {
  if (state.results.length === 0) return
  const index = findPreviewIndex(state)
  const prev = state.results[ index < 1 ? state.results.length - 1 : index - 1  ]
  send('search:setPreview', prev, done)
  send('search:setQuery', prev.search ? prev.search.query : prev.url, done)
  send('search:selectInput', send)
}

function down (payload, state, send, done) {
  if (state.results.length === 0) return
  const index = findPreviewIndex(state)
  const next = state.results[ (index + 1) % state.results.length ]
  send('search:setPreview', next, done)
  send('search:setQuery', next.search ? next.search.query : next.url, done)
  send('search:selectInput', send)
}

function findPreviewIndex (state) {
  if (!state.preview) return -1

  const rows = state.results

  let index = -1
  let i = -1
  const len = rows.length
  while (++i < len) {
    if (rows[i].url !== state.preview.url) continue
    index = i
    break
  }

  return index
}

function addResults (payload, state, send, done) {
  if (payload.query.trim() != state.query.trim()) return console.error('Got results for previous search %s (current: %s)', payload.query, state.query, payload.rows.length)
  send('search:setResults', state.results.concat(payload.rows), done)
}

function _search (payload, state, send, done) {
  const query = payload && payload.query !== undefined ? payload.query : state.query

  searchDB(query, (error, results) => {
    if (error) return console.error('Failed to update search results: ', query)

    send('search:setResults', results, done)
    send('likes:recoverFromSearch', results, done)
    send('domains:recoverFromSearch', results, done)

    if (payload.query.trim().length) suggest(payload, state, send, done)

    if (payload.selectFirstItem) {
      send('search:setPreview', results[0], done)
    }
  })
}

function _suggest (payload, state, send, done) {
  console.log('Getting search suggestions for %s', payload.query)

  http.get(`http://google.com/complete/search?client=chrome&q=${encodeURI(payload.query)}`, (res) => {
    res.setEncoding('utf8')
    let body = ''

    res.on('data', part => {
      body += part
    })

    res.on('error', e => console.error('Failed to get suggestions', e))

    res.on('end', () => {
      const parsed = JSON.parse(body)
      const results = []
      const queries = parsed[1].slice(0, SUGGESTION_LIMIT)

      for (let query of queries) {
        results.push({ search: { query } })
      }

      send('search:addResults', { rows: results, query: payload.query }, done)
    })
  })
}
