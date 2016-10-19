const db = require("./db")
const urls = require("../urls")
const meta = require("./meta")
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
  popular,
  popularDomains
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

  select(options, callback)
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

function popularDomains (options, callback) {
  const result = []
  const limit = 25
  const range = null
  const direction = 'prev'
  const index = 'counter'

  const added = {}

  store.selectRange(index, range, direction, (error, row) => {
    if (error) return callback(error)
    if (!row) return callback(undefined, result)

    const domain = urls.domain(row.value.url)

    if (added[domain]) return row.continue()

    added[domain] = true

    row.value.url = domain
    result.push(row.value)

    if (result.length >= limit) {
      return callback(undefined, result)
    }

    row.continue()
  })
}
