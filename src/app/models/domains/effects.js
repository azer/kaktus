const db = require("../../db")
const urls = require("../../urls")

module.exports = {
  enablePrivateMode,
  disablePrivateMode,
  get
}

function get (url, state, send, done) {
  db.domains.get(url, (error, row) => {
    if (error) return console.error('can not get domain ', error)
    if (!row) return
    send('domains:set', { domain: row.domain, props: row }, done)
  })
}

function enablePrivateMode (url, state, send, done) {
  db.domains.setPrivateMode(url, true, error => {
    if (error) return console.error('can not set privacy mode %s', id)
    get(url, state, send, done)
  })
}

function disablePrivateMode (url, state, send, done) {
  db.domains.setPrivateMode(url, false, error => {
    if (error) return console.error('can not set privacy mode %s', id)
    get(url, state, send, done)
  })
}
