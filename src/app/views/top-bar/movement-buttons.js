const html = require('choo/html')
const forwardButton = movementButton('forward')
const backButton = movementButton('back')
const findInPageButtons = require("../find-in-page").buttons

const audioButton = (state, prev, send) => html`
<div class="button audio ${state.isMuted ? "muted" : ""} active"
     title="${state.isMuted ? "Unmute" : "Mute"}"
     onclick=${(state.isMuted ? unmute : mute)(state, send)}>
  <i class="fa fa-volume-up unmute" aria-hidden="true"></i>
  <i class="fa fa-volume-off mute" aria-hidden="true"></i>
</div>
`

const movementButtons = (state, prev, send) => {
  if (state.findInPage.enabled) return findInPageButtons(state, prev, send)

  const selectedTab = state.tabs[state.tabs.selectedId]

  return html`
  <div class="buttons movement-buttons">
    ${forwardButton(selectedTab.canGoForward, e => forward(selectedTab, prev, send)) }
    ${backButton(selectedTab.canGoBack, e => back(selectedTab, prev, send)) }
    ${selectedTab.isPlayingMedia ? audioButton(selectedTab, prev, send) : null}
  </div>
  `
}

module.exports = movementButtons

function movementButton (type) {
  let icon = type === 'forward' ? '❯' : '❮'
  return (isActive, onclick) => html`
  <div class="button ${type} ${isActive ? 'active' : ''}" onclick=${onclick}>
    ${icon}
  </div>`
}

function mute (state, send) {
  return function () {
    send('tabs:mute', {
      tab: state
    })
  }
}

function unmute (state, send) {
  return function () {
    send('tabs:unmute', {
      tab: state
    })
  }
}

function forward (state, prev, send) {
  if (!state.canGoForward) {
    return
  }

  send('tabs:forward', {
    tab: state
  })
}

function back (state, prev, send) {
  if (!state.canGoBack) {
    return
  }

  send('tabs:back', {
    tab: state
  })
}
