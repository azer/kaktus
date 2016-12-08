const db = require("db")

module.exports = {
  like,
  unlike,
  get
}

function get (url, state, send, done) {
  if (state.hasOwnProperty(url)) {
    return
  }

  db.likes.get(url, (error, row) => {
    if (error) return send('errors:new', { error, msg: `Can not access like record for ${url}` })
    if (!row) return

    send('likes:set', {
      url,
      value: true
    }, done)
  })
}

function like (url, state, send, done) {
  db.likes.like(url, error => {
    if (error) return send('errors:new', { error, msg: `Can not like ${url}` })

    send('likes:set', {
      url,
      value: true
    }, done)
  })
}

function unlike (url, state, send, done) {
  db.likes.unlike(url, error => {
    if (error) return send('errors:new', { error, msg: `Can not unlike ${url}` })

    send('likes:set', {
      url,
      value: false
    }, done)
  })
}
