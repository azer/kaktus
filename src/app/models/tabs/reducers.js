const change = require("change-object")
const titleFromURL = require("title-from-url")
const Tab = require("./tab")
const parseURL = require("url").parse

module.exports = {
  openURL,
  startLoading,
  stopLoading,
  update,
  setSelectedId,
  setTabAsClosed,
  create,
  setState
}

function openURL (payload) {
  return changeTab(payload.tab, newURLProps(fixURL(payload.url)))
}

function setSelectedId (selectedId) {
  return {
    selectedId
  }
}

function update (payload) {
  return changeTab(payload.tab, payload.props)
}

function startLoading (payload) {
  return changeTab(payload.tab, payload.props)
}

function stopLoading (payload) {
  return changeTab(payload.tab, payload.props)
}

function changeTab (tab, updates) {
  var result = {}
  var changed = false
  result[tab.id] = tab

  for (let key in updates) {
    if (tab[key] === updates[key]) continue
    result[tab.id][key] = updates[key]
    changed = true
  }

  if (!changed) return

  return result
}

function setTabAsClosed (id) {
  var result = {}
  result[id] = null
  return result
}

function create (options) {
  var result = {}
  var tab = new Tab(options.id, options.url)

  if (options.select) {
    result['selectedId'] = tab.id
  }

  result[tab.id] = tab

  return result
}

function fixURL (input) {
  if (isSearchQuery(input)) {
    input = `https://google.com/search?q=${input}`
  }

  if (!/^http/.test(input)) {
    return `http://${input}`
  }

  return input
}

function newURLProps (url) {
  return {
    url,
    title: titleFromURL(url),
    description: '',
    icon: '',
    image: undefined,
    error: null,
    isDOMReady: false,
    isLiked: false,
    isNew: false
  }
}

function isSearchQuery (input) {
  return input.indexOf(' ') > -1 || input.indexOf('.') === -1
}

function setState (state) {
  return state
}
