const mix = require("mix-objects");
const lessCommonWords = require("less-common-words");
const anglicize = require("anglicize");
const uniques = require("uniques");
const loop = require("parallel-loop");

const db = require("./db")
const urls = require("./urls");
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
  get
};

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

function search (query, callback) {
  //var keywords = query.split(/[^\w]+/)
  const rows = []

  store.selectRange('tags', { only: query }, function (error, result) {
    if (error) return callback(error)
    if (!result) return callback(undefined, rows)

    rows.push(result.value)
    result.continue()
  })
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
  url = url.replace(/\.(com|net|org)(\/|$|\?|\#)/, '$2');
  url = url.replace(/^\w+:\/\//, '');
  return lessCommonWords(url);
}

function emptyMeta () {
  return {
    title: 'New Tab',
    description: '',
    icon: '',
    image: '',
    tags: ''
  }
}
