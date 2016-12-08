const defaults = require("./defaults")

module.exports = {
  create,
  set
}

function create (payload) {
  const update = {}
  update[payload.id] = defaults()
  update[payload.id].partition = payload.partition
  return update
}

function set (state) {
  return state
}
