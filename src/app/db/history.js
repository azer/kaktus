const db = require("./db")
const urls = require("../urls")
const meta = require("./meta")
const recommended = require("../../recommended")
const loop = require("parallel-loop")
const store = db.store('history', {
  key: { keyPath: "url" },
  indexes: [
    { name: 'lastUpdatedAt', options: { unique: false } },
    { name: 'counter', options: { unique: false } }
  ]
})

module.exports = {
  foreignName: 'record',
  foreignKey: 'url',
  store,
  visit,
  get,
  all,
  select,
  popular
}

function visit (url, callback) {
  save({
    protocol: urls.protocol(url),
    url: urls.clean(url),
    webviewURL: url,
    lastUpdatedAt: Date.now()
  }, callback)
}

function save (props, callback) {
  store.get(props.url, function (error, existing) {
    if (error) return callback(error)
    if (existing) {
      props.counter = (existing.counter || 0) + 1
      return store.update(props, callback)
    }

    store.add(props, callback)
  })
}

function all (options, callback) {
  options.index = options.index || 'lastUpdatedAt'
  select(options, callback)
}

function popular (options, callback) {
  if (!options) {
    options = {}
  }

  options.index = 'counter'

  select(options, (error, rows) => {
    if (error) return callback(error)

    if (rows && rows.length) return callback(undefined, rows)

    addRecommendedSites((error) => {
      if (error) return callback(error)

      popular(options, callback)
    })
  })
}

function select (options, callback) {
  const result = []
  const limit = options.limit || 25
  const range = options.range || null
  const direction = options.direction || 'prev'

  store.selectRange(options.index, range, direction, (error, row) => {
    if (error) return callback(error)
    if (!row) return callback(undefined, result)

    result.push(row.value)

    if (result.length >= limit) {
      return callback(undefined, result)
    }

    row.continue()
  })
}

function get (url, callback) {
  store.get(url, callback)
}

function addRecommendedSites (callback) {
  loop(recommended.length, each, callback)

  function each (done, index) {
    recommended[index].isPopularRecord = true

    save({
      protocol: urls.protocol(recommended[index].url),
      url: urls.clean(recommended[index].url),
      webviewURL: recommended[index].url,
      lastUpdatedAt: Date.now() - (index * 1000),
      counter: 5,
      isPopularRecord: true
    }, error => {
      if (error) return done(error)
      meta.save(recommended[index], done)
    })

  }
}
