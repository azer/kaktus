module.exports = {
  clean,
  'new': newError
}

function clean (payload, state, send, done) {
  send('errors:set', null, done)
}

function newError (payload, state, send, done) {
  console.error(payload.msg, {
    error: payload.error
  })
}
