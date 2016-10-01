const html = require('choo/html')
const debounce = require("debounce-fn");
const movementButtons = require("./movement-buttons")
const searchResults = require("../search-results")
const createTitleBar = require('../title-bar')

const input = (state, prev, send) => {
  const selectedTab = state.tabs[state.tabs.selectedId]

  return html`
    <input class="url"
      value='${cleanURL(state.search.query)}'
      placeholder='${selectedTab.url || "Search or type a website name"}'
      onkeyup=${onKeyUp(selectedTab, prev, send)}
      oninput=${onInput(selectedTab, prev, send)}
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
    var classes = event.target.classList;
    if (!classes.contains("navigation-bar") && !classes.contains("movement-buttons")) {
      return;
    }

    if (state.tabs[state.tabs.selectedId].isNew) return;

    send('search:quit')
  }
}

function onKeyUp (tab, prev, send) {
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

      return send('tabs:go', {
        url: e.target.value,
        tab
      })
    }

    if (e.keyCode === 27) {
      return send('search:quit')
    }
  }
}

function onInput (tab, prev, send) {
  const search = debounce(_search, 300)

  return function (e) {
    send('search:setQuery', e.target.value)
    search(e.target.value)
  }

  function _search (value) {
    send('search:search', {
      query: value
    })
  }
}

function cleanURL (url) {
  if (!/^\w+:\/\//.test(url)) return url

  return url
    .trim()
    .replace(/^\w+:\/\//, '')
    .replace(/(\/|\?|\&)*$/, '')
}
