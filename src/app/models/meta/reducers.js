module.exports = {
  set
}

function set (payload) {
  const update = {}
  update[payload.url] = payload.props
  return update
}
