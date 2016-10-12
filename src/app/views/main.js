const html = require('choo/html')
const { ipcRenderer } = electronRequire('electron')
const top = require("./top-bar")
const listOfTabs = require("../list-of-tabs")
const webviews = require("./webviews")
let initialized = false

const main = (state, prev, send) => {
  if (!ready(state, prev, send) || listOfTabs(state).length === 0) {
    return loading(state, prev, send)
  }

  return html`<main>
    <div class="main ${state.general.privateMode ? 'private-mode' : ''} ${state.general.focusMode ? 'focus-mode' : ''}">
      ${privacyIcon(state, prev, send)}
      ${top(state, prev, send)}
      ${webviews(state, prev, send)}
    </div>
  </main>`
}

const loading = (state, prev, send) => html`<main><div class="main-loading">Kaktüs</div></main>`

module.exports = main

function ready (state, prev, send) {
  if (initialized) {
    return true
  }

  initialized = true

  ipcRenderer.on('action', function (event, message) {
    console.log(message.name, message.payload)
    send(message.name, message.payload)
  })
}


function privacyIcon (state) {
  if (!state.general.privateMode) return

  return html`<div class="private-mode-window-icon" title="Private Mode">
    <i class="fa fa-user-secret" aria-hidden="true"></i>
  </div>`
}
