const url = require("./url")
const searchQuery = require("./search-query")

module.exports = show

function show (state, prev, send) {
  const view = pick(state)
  if (view) return view(state, prev, send)
}

function pick (state, prev, send) {
  if (!state.search.preview) return
  if (state.search.preview.search) return searchQuery
  return url
}
