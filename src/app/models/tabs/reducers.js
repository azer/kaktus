const change = require("change-object")
const titleFromURL = require("title-from-url")
const Tab = require("./tab")
const parseURL = require("url").parse
const urls = require("../../urls")

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
  return changeTab(payload.tab, newURLProps(urls.normalize(payload.url)))
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

    if (key === 'url' && /^\w+:\/\//.test(updates[key])) {
      result[tab.id].webviewURL = updates.url
      result[tab.id].protocol = urls.protocol(updates.url)
      result[tab.id].url = urls.clean(updates.url)
    }

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
  var tab = new Tab(options.id, urls.protocol(options.url), urls.clean(options.url))

  if (options.select) {
    result['selectedId'] = tab.id
  }

  result[tab.id] = tab

  return result
}

function newURLProps (url) {
  return {
    protocol: urls.protocol(url),
    url: urls.clean(url),
    webviewURL: url,
    title: titleFromURL(url),
    description: '',
    icon: '',
    image: undefined,
    error: null,
    isDOMReady: false,
    isNew: false
  }
}

function setState (state) {
  return state
}
