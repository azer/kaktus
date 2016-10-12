const search = require("../../search")
const input = require("../../input")

module.exports = {
  open,
  quit,
  search: searchEffect,
  up,
  down,
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

  if (payload.search !== undefined) {
    searchEffect({ query: payload.search }, state, send, done)
  }
}

function quit (payload, state, send, done) {
  if (!state.isOpen) return
  send('search:setAsClosed', done)
}

function searchEffect (payload, state, send, done) {
  const query = payload && payload.query !== undefined ? payload.query : state.query

  search(query, (error, results) => {
    if (error) return console.error('Failed to update search results: ', query)

    //send('search:setPreview', results[0], done)
    send('search:setResults', results, done)
    send('likes:recoverFromSearch', results, done)
    send('domains:recoverFromSearch', results, done)
  })
}

function up (payload, state, send, done) {
  if (state.results.length === 0) return
  const index = findPreviewIndex(state)
  const prev = state.results[ index < 1 ? state.results.length - 1 : index - 1  ]
  send('search:setPreview', prev, done)
  send('search:setQuery', prev.url, done)
  send('search:selectInput', send)
}

function down (payload, state, send, done) {
  if (state.results.length === 0) return
  const index = findPreviewIndex(state)
  const next = state.results[ (index + 1) % state.results.length ]
  send('search:setPreview', next, done)
  send('search:setQuery', next.url, done)
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
