const db = require("../../db")

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
    if (error) return console.error('can not get like ', error)
    if (!row) return

    send('likes:set', {
      url,
      value: true
    }, done)
  })
}

function like (url, state, send, done) {
  db.likes.like(url, error => {
    if (error) return console.error('can not like %s', id)

    send('likes:set', {
      url,
      value: true
    }, done)
  })
}

function unlike (url, state, send, done) {
  db.likes.unlike(url, error => {
    if (error) return console.error('can not unlike %s', id)

    send('likes:set', {
      url,
      value: false
    }, done)
  })
}
