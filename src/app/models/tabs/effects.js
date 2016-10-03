const db = require("../../db")
const searchRows = require("../../models/tabs").searchRows
const listOfTabs = require("../../list-of-tabs")
const Tab = require("./tab")

const MAX_ZOOM_LEVEL = 9
const MIN_ZOOM_LEVEL = -8
const DEFAULT_ZOOM_LEVEL = 0
const ZOOM_INCR_VAL = 1

module.exports = {
  recoverTabs,
  go,
  newTab,
  select,
  close,
  closeSelectedTab,
  updateURL,
  updateURLMeta,
  like,
  unlike,
  back: withWebView(back),
  forward: withWebView(forward),
  reload: withWebView(reload),
  stop: withWebView(stop),
  print: withWebView(print),
  mute: withWebView(setAudioMuted(true)),
  unmute: withWebView(setAudioMuted(false)),
  zoomIn: withWebView(zoomIn),
  zoomOut: withWebView(zoomOut),
  resetZoom: withWebView(resetZoom),
  openDevTools: withWebView(openDevTools),
  findInPage: withWebView(findInPage),
  quitFindInPage: withWebView(quitFindInPage),
  findNextInPage: withWebView(findNextInPage),
  findPreviousInPage: withWebView(findPreviousInPage)
}

function recoverTabs (payload, state, send, done) {
  db.embed(db.tabs.all, [db.meta, db.history, db.likes], (error, all) => {
    if (error) return console.error('can not recover tabs', error)
    if (all.length === 0) return newTab(null, state, send, done)

    let newState = {}

    all.forEach(el => {
      let url = ''
      if (el.record) {
        url = `${el.record.protocol || 'http'}://${el.record.url}`
      }

      const t = new Tab(el.id, url)

      if (el.meta) {
        t.image = el.meta.image
        t.icon = el.meta.icon
        t.title = el.meta.title
        t.description = el.meta.description
      }

      t.createdAt = el.createdAt
      t.isSelected = !!el.isSelected
      t.isLiked = !!el.isLiked

      if (t.isSelected) {
        newState.selectedId = t.id
      }

      newState[t.id] = t
    })

    send('tabs:setState', newState, done)
    if (newState[newState.selectedId].isNew) {
      send('search:open', { search: '' }, done)
    }
  })
}

function close (id, state, send, done) {
  db.tabs.close(id, error => {
    if (error) return console.error('can not close tab', error)

    let next = -1
    const all = listOfTabs(state)
    let i = all.length
    while (i--) {
      if (all[i].id !== id) continue
      next = (i + 1) % all.length
      break
    }

    if (next === -1 || all.length === 1) {
      newTab(null, state, send, done)
    } else {
      select(all[next].id, state, send, done)
    }

    send('tabs:setTabAsClosed', id, done)
    send('search:search', { query: '' }, done)
  })
}

function closeSelectedTab (payload, state, send, done) {
  close(state.selectedId, state, send, done)
}

function newTab (payload, state, send, done) {
  if (switchToExistingNewTab(payload, state, send, done)) return
  if (state[state.selectedId] && state[state.selectedId].isNew) return

  db.tabs.create(payload ? payload.url : '', (error, id) => {
    if (error) return console.error('Fatal, can not create tab: ', error)

    db.tabs.select(id, error => {
      if (error) console.error('Can not select the new tab created', error)

      send('tabs:create', { id: id, url: payload && payload.url || '', select: true }, done)

      if (!payload || !payload.url) {
        send('search:open', { search: '' }, done)
      }
    })
  })
}

function switchToExistingNewTab (payload, state, send, done) {
  if (payload && payload.url) return

  const all = listOfTabs(state)
  let existing

  for (let tab of all) {
    if (!tab.isNew) continue
    existing = tab
    break
  }

  if (!existing) return

  select(existing.id, state, send, done)
  return true
}

function select (id, state, send, done) {
  send('tabs:setSelectedId', id, done)

  db.tabs.select(id, error => {
    if (error) return console.error('can not select tab', error)
  })
}

function like (tab, state, send, done) {
  db.likes.like(tab.url, error => {
    if (error) return console.error('can not like %s', id)

    send('tabs:update', {
      tab: tab,
      props: {
        isLiked: true
      }
    }, done)
  })
}

function unlike (tab, state, send, done) {
  db.likes.unlike(tab.url, error => {
    if (error) return console.error('can not unlike %s', id)
    send('tabs:update', {
      tab: tab,
      props: {
        isLiked: false
      }
    }, done)
  })
}

function go (payload, state, send, done) {
  db.tabs.get(payload.url, (error, tab) => {
    if (error) return console.error('can not get tabs')
    if (!tab) return _go(payload, state, send, done)
    if (tab.id === payload.tab.id) return

    db.tabs.close(payload.tab.id, error => {
      if (error) return console.error('can not close tab', error)

      select(tab.id, state, send, done)
      send('tabs:setTabAsClosed', payload.tab.id, done)
    })
  })
}

function _go (payload, state, send, done) {
  console.log('Go to %s', payload.url)

  send('tabs:openURL', payload, done)

  if (!/^\w+:\/\//.test(payload.url)) return

  db.tabs.updateURL(payload.tab.id, payload.url, error => {
    if (error) console.error('Can not update tab url', payload.url, error)
  })

  db.history.visit(payload.url, (error) => {
    if (error) return console.error('Can not add %s to history', payload.url, error)
  })

  db.likes.get(payload.url, (error, isLiked) => {
    if (error) return console.error('can not read like value from db', error)

    send('tabs:update', {
      tab: payload.tab,
      props: {
        isLiked
      }
    }, done)
  })
}

function updateURL (payload, state, send, done) {
  console.log('Update URL to %s', payload.url)

  send('tabs:update', {
    tab: payload.tab,
    props: {
      url: payload.url
    }
  }, done)

  db.likes.get(payload.url, (error, isLiked) => {
    if (error) console.error('can not read like value from db', error)

    send('tabs:update', {
      tab: payload.tab,
      props: {
        isLiked
      }
    }, done)
  })

  if (!/^\w+:\/\//.test(payload.url)) return

  db.tabs.updateURL(payload.tab.id, payload.url, error => {
    if (error) console.error('Can not update tab url', payload.url, error)
  })

  db.history.visit(payload.url, function (error, result) {
    if (error) return console.error('Can not add %s to history', payload.url, error)
  })
}

function updateURLMeta (payload, state, send, done) {
  send('tabs:update', payload, done)

  const props = {
    url: payload.tab.url
  }

  for (let key in payload.props) {
    props[key] = payload.props[key]
  }

  db.meta.save(props, (error, result) => {
    if (error) return console.error('Can not save %s meta props', props.url, error)
  })
}

function back (webview) {
  webview.goBack()
}

function forward (webview) {
  webview.goForward()
}

function reload (webview, payload, send, done) {
  webview.reloadIgnoringCache()

  send('tabs:update', {
    tab: payload.tab,
    props: {
      error: null
    }
  }, done)
}

function stop (webview) {
  webview.stop()
}

function print (webview, payload, send, done) {
  webview.print()
}

function zoomIn (webview, payload) {
  if (paylod.tab.zoomLevel >= MAX_ZOOM_LEVEL) {
    return
  }

  payload.tab.zoomLevel += ZOOM_INCR_VAL

  webview.setZoomLevel(payload.tab.zoomLevel)
}

function zoomOut (webview, payload) {
  if (payload.tab.zoomLevel <= MIN_ZOOM_LEVEL) {
    return
  }

  payload.tab.zoomLevel -= ZOOM_INCR_VAL

  webview.setZoomLevel(payload.tab.zoomLevel)
}

function resetZoom (webview, payload) {
  payload.tab.zoomLevel = DEFAULT_ZOOM_LEVEL
  webview.setZoomLevel(payload.tab.zoomLevel)
}

function openDevTools (webview) {
  webview.openDevTools()
}

function setAudioMuted (bool) {
  return function (webview, payload, send, done) {
    webview.setAudioMuted(bool)

    send('tabs:update', {
      tab: payload.tab,
      props: {
        isMuted: bool
      }
    }, done)
  }
}

function findInPage (webview, payload) {
  webview.findInPage(payload.query)
}

function findNextInPage (webview, payload) {
  webview.findInPage(payload.query, {
    findNext: true,
    forward: true
  })
}

function findPreviousInPage (webview, payload) {
  webview.findInPage(payload.query, {
    findNext: true,
    forward: false
  })
}

function quitFindInPage (webview) {
  webview.stopFindInPage('clearSelection')
}

function withWebView (method) {
  return function (payload, state, send, done) {
    if (!payload) {
      payload = {}
    }

    if (!payload.tab) {
      payload.tab = state[state.selectedId]
    }

    var webview = document.querySelector(`#${payload.tab.id}`)
    if (!webview) return

    method(webview, payload, send, done)
  }
}
