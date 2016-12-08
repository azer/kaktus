const db = require("db")

module.exports = {
  get,
  update
}

function get (url, state, send, done) {
  db.meta.get(url, (error, row) => {
    if (error) return send('errors:new', { error, msg: `Can not access meta information for ${url}` })
    send('meta:set', { url: row.url, props: row }, done)
  })
}

function update (payload, state, send, done) {
  const repl = state[payload.url] || {}
  let changed = false

  for (let key of payload.props) {
    if (payload.props[key] === repl[key]) continue
    changed = true
    repl[key] = payload.props[key]
  }

  if (!changed) return

  send('meta:set', { url: payload.url, props: payload.props }, done)

  db.meta.set(payload.url, payload.props, error => {
    if (error) return send('errors:new', { error, msg: `Can not set meta info for ${payload.url} in DB.` })
  })
}
