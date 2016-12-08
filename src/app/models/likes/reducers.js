module.exports = {
  recover,
  recoverFromSearch,
  set
}

function set (payload) {
  const update = {}
  update[payload.url] = !!payload.value
  return update
}

function recover (rows) {
  const state = {}

  for (let row of rows) {
    if (row.like) {
      state[row.url] = true
    }
  }

  return state
}

function recoverFromSearch (results) {
  const updates = {}

  for (let row of results) {
    if (!row.like) continue
    updates[row.url] = true
  }

  return updates
}
