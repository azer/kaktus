const db = require("../../db")
const urls = require("../../urls")

module.exports = {
  enablePrivacyMode,
  disablePrivacyMode,
  get
}

function get (url, state, send, done) {
  db.domains.get(url, (error, row) => {
    if (error) return console.error('can not get domain ', error)
    if (!row) return
    send('domains:set', { domain: row.domain, props: row }, done)
  })
}

function enablePrivacyMode (url, state, send, done) {
  db.domains.setPrivacyMode(url, true, error => {
    if (error) return console.error('can not set privacy mode %s', id)
    get(url, state, send, done)
  })
}

function disablePrivacyMode (url, state, send, done) {
  db.domains.setPrivacyMode(url, false, error => {
    if (error) return console.error('can not set privacy mode %s', id)
    get(url, state, send, done)
  })
}
