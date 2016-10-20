const html = require('choo/html')
const debounce = require("debounce-fn")
const movementButtons = require("./movement-buttons")
const searchResults = require("../search-results")
const createTitleBar = require('../title-bar')
let search

const input = (state, prev, send) => {
  const selectedTab = state.tabs[state.tabs.selectedId]
  search || (search = _search(send))

  return html`
    <input class="url"
      value='${state.search.query}'
      placeholder='${selectedTab.url || "Search or type a website name"}'
      onkeyup=${onKeyUp(state, prev, send)}
      oninput=${onInput(selectedTab, search, send)}
      x-webkit-speech />
  `
}

const searchBar = (state, prev, send) => {
  const titleBar = createTitleBar(input(state, prev, send))

  return html`
    <div class="top-bar navigation-bar" onclick=${onBlur(state, prev, send)}>
      ${movementButtons(state, prev, send)}
      ${titleBar(state, prev, send)}
      ${searchResults(state, prev, send)}
    </div>`
}

module.exports = searchBar

function onBlur (state, prev, send) {
  return function (event) {
    var classes = event.target.classList
    if (!classes.contains("navigation-bar") && !classes.contains("movement-buttons")) {
      return
    }

    if (state.tabs[state.tabs.selectedId].isNew) return

    send('search:quit')
  }
}

function onKeyUp (state, prev, send) {
  return function (e) {
    if (e.keyCode === 38) {
      e.stopPropagation()
      e.preventDefault()
      send('search:up')
      return false
    }

    if (e.keyCode === 40) {
      e.stopPropagation()
      e.preventDefault()
      send('search:down')
      return false
    }

    if (e.keyCode === 13) {
      send('search:quit')

      if (selectedTab(state)) {
        return send('tabs:select', state.search.preview.tab.id)
      }

      return send('tabs:go', {
        url: e.target.value,
        tab: state.tabs[state.tabs.selectedId]
      })
    }

    if (e.keyCode === 27) {
      return send('search:quit')
    }
  }
}

function onInput (tab, search, send) {
  return function (e) {
    send('search:setQuery', e.target.value)
    search(e.target.value)
  }
}

function selectedTab (state) {
  const preview = state.search.preview
  if (!preview) return false

  const isPreviewTab = preview.tab
  if (!isPreviewTab) return false

  return state.search.preview.tab.id !== state.tabs.selectedId
}

function _search (send) {
  return debounce(function (query) {
    send('search:search', {
      query
    })
  })
}
