const db = require("db")

module.exports = {
  enablePrivateMode,
  disablePrivateMode,
  get
}

function get (url, state, send, done) {
  db.domains.get(url, (error, row) => {
    if (error) return send('errors:new', { error, msg: `Can not get domain settings for ${url}` })
    if (!row) return

    send('domains:set', { domain: row.domain, props: row }, done)
  })
}

function enablePrivateMode (url, state, send, done) {
  db.domains.setPrivateMode(url, true, error => {
    if (error) return send('errors:new', { error, msg: `Can not set privacy mode for ${url}` })
    get(url, state, send, done)
  })
}

function disablePrivateMode (url, state, send, done) {
  db.domains.setPrivateMode(url, false, error => {
    if (error) return send('errors:new', { error, msg: `Can not set privacy mode for ${url}` })
    get(url, state, send, done)
  })
}
