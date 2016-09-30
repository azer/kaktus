const tabs = require("../../models/tabs");
const search = require('./search-bar')
const surfing = require('./surfing-bar')

module.exports = topbar

function topbar (state, prev, send) {
  let view = surfing
  const selected = state.tabs[state.tabs.selectedId]

  if (state.search.isOpen) {
    view = search
  }

  if (!state.search.isOpen && state.tabs[state.tabs.selectedId].isNew) {
    send('search:open', {
      search: ''
    })
  }

  return view(state, prev, send)
}
