const db = require("db")

module.exports = {
  close,
  filter,
  init,
  kill,
  open,
  select,
  setURL,
  sync
}

function close (payload, state, send, done) {
  db.buffers.kill(payload.id, error => {
    if (error) return send('errors:new', { error, msg: `Can not close buffer ${payload.id}` })
    sync(null, state, send, done)
  })
}


function init (payload, state, send, done) {
  if (payload.window === 1) return sync(payload, state, send, done)

  db.buffers.killAll(window.id, error => {
    if (error) return send('errors:new', { error, msg: `Can not kill all buffers under window ${payload.window}` })

    sync(payload, state, send, done)
  })
}

function filter (payload, state, send, done) {
  const result = []

  db.buffers.filter(state.window, payload.query, (error, row) => {
    if (error) return send('errors:new', new Error(`Failed to filter buffers for window ${state.window} with query ${payload.query}`), done)
    if (!row) return send('buffers:set', result, done)
    result.push(row.value)
    row.continue()
  })
}

function kill (payload, state, send, done) {
  db.buffers.kill(payload.id, error => {
    if (error) return send('errors:new', { error, msg: `Can not kill buffer ${payload.id}` })
    sync(null, state, send, done)
  })
}

function open (payload, state, send, done) {
  db.buffers.create(state.window, payload.url, (error, windowId) => {
    if (error) return send('errors:new', { error, msg: `Can not open URL (${payload.url}) in new buffer` })

    sync(null, state, send, done)
  })
}

function select (payload, state, send, done) {
  db.buffers.select(payload.id, error => {
    if (error) return send('errors:new', { error, msg: `Can not select buffer ${payload.id} in window ${window.id}` })
    sync(null, state, send, done)
  })
}

function setURL (payload, state, send, done) {
  db.buffers.setURL(payload.id, payload.url, error => {
    if (error) return send('errors:new', { error, msg: `Can not set URL of buffer ${payload.id}` })
    sync(null, state, send, done)
  })
}

function sync (payload, state, send, done) {
  const all = []
  const window = payload && payload.window ? payload.window : state.window

  db.buffers.all(window, (error, row) => {
    if (error) return send('errors:new', new Error(`Failed to get list of buffers for window ${state.window}`), done)
    if (row) {
      all.push(row.value)
      return row.continue()
    }

    if (all.length === 0) {
      db.buffers.create(window, '', error => {
        if (error) return send('errors:new', { error, msg: `Can not create new empty buffer` })
        sync(payload, state, send, done)
      })
    }

    db.buffers.getSelected(window, (error, selected) => {
      if (error) return send('errors:new', { error, msg: `Can not get selected buffer` })
      send('buffers:set', { window: window, list: all, selected: selected.id }, done)
    })
  })
}
