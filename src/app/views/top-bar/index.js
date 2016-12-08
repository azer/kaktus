const search = require('./search-bar')
const surfing = require('./surfing-bar')

module.exports = topbar

function topbar (state, prev, send) {
  let view = surfing

  if (state.search.isOpen) {
    view = search
  }

  return view(state, prev, send)
}
