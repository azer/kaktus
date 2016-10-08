const db = require("./db")
const urls = require("../urls")
const store = db.store('domains', {
  key: { keyPath: "domain" }
})

module.exports = {
  foreignName: 'domain',
  foreignKey: 'url',
  setPrivacyMode,
  get
}

function get (url, callback) {
  store.get(urls.domain(url), callback)
}

function setPrivacyMode (url, value, callback) {
  save({
    domain: urls.domain(url),
    privacyMode: value
  }, callback)
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
