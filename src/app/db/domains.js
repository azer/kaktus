const db = require("./db")
const urls = require("../urls")
const store = db.store('domains', {
  key: { keyPath: "domain" }
})

const PRIVATE_BY_DEFAULT = [
  'google.com'
]

module.exports = {
  foreignName: 'domain',
  foreignKey: 'url',
  setPrivateMode,
  get
}

function get (url, callback) {
  const domain = urls.domain(url)

  store.get(domain, (error, row) => {
    if (error) return callback(error)
    if (row) return callback(undefined, row)
    if (PRIVATE_BY_DEFAULT.indexOf(domain) === -1) return callback()

    setPrivateMode(domain, true, error => {
      if (error) return callback(error)
      get(url, callback)
    })
  })
}

function _setPrivateMode (domain, value, callback) {
  save({
    domain,
    privateMode: value
  }, callback)
}

function setPrivateMode (url, value, callback) {
  _setPrivateMode(urls.domain(url), value, callback)
}

function save (props, callback) {
  store.get(props.domain, function (error, existing) {
    if (error) return callback(error)
    if (existing) {
      return store.update(props, callback)
    }

    store.add(props, callback)
  })
}
