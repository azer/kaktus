module.exports = {
  recover,
  recoverFromSearch,
  set
}

function set (payload) {
  const update = {}
  update[payload.domain] = payload.props
  return update
}

function recover (rows) {
  const state = {}

  for (let row of rows) {
    if (row.domain) {
      state[row.domain.domain] = row.domain
    }
  }

  return state
}

function recoverFromSearch (results) {
  const updates = {}

  for (let row of results) {
    if (!row.domain) continue
    updates[row.domain.domain] = row.domain
  }

  return updates
}
