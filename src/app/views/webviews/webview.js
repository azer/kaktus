const openContextMenu = require("./context-menu")
const WebviewElement = require("./webview-element")
const partition = require("../../partition")

module.exports = show

function show (id, state, prev, send) {
  const webview = state.webviews[id]

  return new WebviewElement({
    id,
    src: webview.src,
    isPrivate: partition.isPrivateModeDomain(webview.src, state),
    partition: partition.webview(webview.src, state),
    onWebviewUpdate: onWebviewUpdate(state, prev, send),
    onMetaUpdate: onMetaUpdate(state, prev, send),
    onBufferUpdate: onBufferUpdate(state, prev, send),
    onContextMenu: onContextMenu(state, prev, send),
    onOpenNewBuffer: onOpenNewBuffer(state, prev, send)
  }, send)
}

function onWebviewUpdate (state, prev, send) {
  return function (payload) {
    send('webviews:update', payload)
  }
}

function onMetaUpdate (state, prev, send) {
  return function (payload) {
    send('meta:update', payload)
  }
}

function onBufferUpdate (state, prev, send) {
  return function (payload) {
    send('buffers:update', payload)
  }
}

function onContextMenu (state, prev, send) {
  return function (event) {
    openContextMenu(event.args[0], event.target, state, send)
  }
}

function onOpenNewBuffer (state, prev, send) {
  return function (event) {
    send('buffers:open', { url: event.url })
  }
}
