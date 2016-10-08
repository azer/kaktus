const db = require("./db")
const urls = require("../urls")
const store = db.store('likes', {
  key: { keyPath: "url" },
  indexes: [
    { name: 'likedAt', options: { unique: false } }
  ],
  upgrade
})

module.exports = {
  foreignName: 'like',
  foreignKey: 'url',
  store,
  like,
  unlike,
  get,
  all
}

function like (url, callback) {
  store.add({
    url: urls.clean(url),
    likedAt: Date.now()
  }, callback)
}

function unlike (url, callback) {
  store.delete(urls.clean(url), callback)
}

function get (url, callback) {
  store.get(urls.clean(url), callback)
}

function all (options, callback) {
  const result = []
  const limit = options.limit || 25
  const range = options.range || null
  const direction = options.direction || 'prev'

  store.selectRange('likedAt', range, direction, (error, row) => {
    if (error) return callback(error)
    if (!row) return callback(undefined, result)

    result.push(row.value)

    if (result.length >= limit) {
      return callback(undefined, result)
    }

    row.continue()
  })
}

function upgrade () {
  store.createIndex('likedAt', { unique: false })
}
