const defaults = require("./defaults")

const MAX_ZOOM_LEVEL = 9
const MIN_ZOOM_LEVEL = -8
const DEFAULT_ZOOM_LEVEL = defaults.zoomLevel
const ZOOM_INCR_VAL = 1

module.exports = withWebView({
  back,
  findInPage,
  findNextInPage,
  findPreviousInPage,
  forward,
  mute,
  openDevTools,
  print,
  reload,
  reloadIgnoringCache,
  stop,
  resetZoom,
  quitFindInPage,
  unmute,
  zoomIn,
  zoomOut
})

function back (payload) {
  payload.dom.goBack()
}

function forward (payload) {
  payload.dom.goForward()
}

function reload (payload, send, done) {
  payload.dom.reload()

  send('webviews:resetProps', {
    id: payload.id
  }, done)
}

function reloadIgnoringCache (payload, send, done) {
  payload.dom.reloadIgnoringCache()

  send('webviews:resetProps', {
    id: payload.id
  }, done)
}

function stop (payload) {
  payload.dom.stop()
}

function print (payload, state, send, done) {
  payload.dom.print()
}

function zoomIn (payload, state, send, done) {
  if (payload.props.zoomLevel >= MAX_ZOOM_LEVEL) {
    return
  }

  send('webviews:setProps', {
    id: payload.props.id,
    props: {
      zoomLevel: payload.props.zoomLevel + ZOOM_INCR_VAL
    }
  }, done)

  payload.dom.setZoomLevel(payload.props.zoomLevel + ZOOM_INCR_VAL)
}

function zoomOut (payload, state, send, done) {
  if (payload.props.zoomLevel <= MIN_ZOOM_LEVEL) {
    return
  }

  send('webviews:setProps', {
    id: payload.props.id,
    props: {
      zoomLevel: payload.props.zoomLevel - ZOOM_INCR_VAL
    }
  }, done)

  payload.dom.setZoomLevel(payload.props.zoomLevel - ZOOM_INCR_VAL)
}

function resetZoom (payload, state, send, done) {
  send('webviews:setProps', {
    id: payload.props.id,
    props: {
      zoomLevel: DEFAULT_ZOOM_LEVEL
    }
  }, done)

  payload.dom.setZoomLevel(DEFAULT_ZOOM_LEVEL)
}

function openDevTools (payload) {
  payload.dom.openDevTools()
}

function mute (payload, state, send, done) {
  payload.dom.setAudioMuted(true)
  send('webviews:setProps', {
    id: payload.props.id,
    props: {
      isMuted: true
    }
  }, done)
}

function unmute (payload, state, send, done) {
  payload.dom.setAudioMuted(false)

  send('webviews:setProps', {
    id: payload.props.id,
    props: {
      isMuted: false
    }
  }, done)
}

function findInPage (payload) {
  payload.dom.findInPage(payload.query)
}

function findNextInPage (payload) {
  payload.dom.findInPage(payload.query, {
    findNext: true,
    forward: true
  })
}

function findPreviousInPage (payload) {
  payload.dom.findInPage(payload.query, {
    findNext: true,
    forward: false
  })
}

function quitFindInPage (payload) {
  payload.dom.stopFindInPage('clearSelection')
}

function withWebView (fns) {
  const result = {}

  for (let key of fns) {
    result[key] = callEffect(fns[key])
  }

  return result
}

function callEffect (effect) {
  return function (payload, state, send, done) {
    payload.el = document.querySelector(`#${payload.id}`)
    payload.props = state[payload.id] || defaults

    if (!payload.el) {
      return send('errors:new', { msg: `Can not find webview element of buffer ${payload.id}` })
    }

    effect(payload, state, send, done)
  }
}
