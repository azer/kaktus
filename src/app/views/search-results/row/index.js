const tab = require("./tab")
const like = require("./like")
const popular = require("./popular")
const history = require("./history")
const searchQuery = require("./search-query")
const separator = require("./separator")

module.exports = show

function show (row, state, prev, send) {
  return pick(row)(row, state, prev, send)
}

function pick (row, state, prev, send) {
  if (row.separator) return separator
  if (row.tab) return tab
  if (row.like) return like
  if (row.popular) return popular
  if (row.search) return searchQuery
  return history
}
