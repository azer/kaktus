const mix = require("mix-objects")
const lessCommonWords = require("less-common-words")
const titleFromURL = require("title-from-url");
const anglicize = require("anglicize")
const uniques = require("uniques")
const loop = require("parallel-loop")

const db = require("./db")
const urls = require("../urls")
const store = db.store('meta', {
  key: { keyPath: "metaURL" },
  indexes: [
    { name: 'url', options: { unique: true } },
    { name: 'tags', options: { multiEntry: true, unique: false } }
  ]
})

module.exports = {
  foreignName: 'meta',
  foreignKey: 'url',
  store,
  save,
  search,
  get,
  draft
}

function save (props, callback) {
  props.url = urls.clean(props.url)
  props.metaURL = urls.meta(props.url)
  props.lastUpdatedAt = Date.now()

  store.get(props.metaURL, function (error, existing) {
    if (error) return callback(error)

    if (existing) {
      let mixed = mix(props, [existing])
      mixed.tags = extractTags(mixed)
      return store.update(mixed, callback)
    }

    props.tags = extractTags(props)
    store.add(props, callback)
  })
}

function _search (query, each, done) {
  store.selectRange('tags', { only: query }, function (error, result) {
    if (error) return callback(error)
    if (result) {
      each(result.value)
      return result.continue()
    }

    store.selectRange('url', { from: query, to: query + 'uffff' }, function (error, result) {
      if (error) return callback(error)
      if (result) {
        each(result.value)
        return result.continue()
      }

      done()
    })
  })
}

function search (query, callback) {
  var keywords = query.trim().split(/[^\w]+/).filter(q => q.length)
  const rows = []
  const added = {}

  console.log('Searching ', keywords)

  loop(keywords.length, each, errors => {
    if (errors) return callback(errors[0])
    callback(undefined, rows)
  })

  function each (done, index) {
    _search(keywords[index], add, done)
  }

  function add (row) {
    if (added[row.url]) return

    added[row.url] = true
    rows.push(row)
  }
}

function get (url, callback) {
  store.get(urls.meta(url), (error, result) => {
    callback(error, result)
  })
}

function extractTags (props) {
  const all = extractTagsFromURL(props.url)
    .concat(extractTagsFromText(props.title || ''))
    .concat(extractTagsFromText(props.description || ''))
    .concat(extractTagsFromText(props.keywords || ''))

  return uniques(all)
}

function extractTagsFromText (text) {
  return lessCommonWords(anglicize(text.toLowerCase()))
}

function extractTagsFromURL (url) {
  url = url.replace(/\.(com|net|org)(\/|$|\?|\#)/, '$2')
  url = url.replace(/^\w+:\/\//, '')
  return lessCommonWords(url)
}

function draft (url) {
  return {
    url: url,
    title: url ? titleFromURL(url) : 'New Tab',
    description: '',
    icon: '',
    image: '',
    tags: ''
  }
}
