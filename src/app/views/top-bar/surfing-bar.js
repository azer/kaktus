const html = require('choo/html')
const titleFromURL = require("title-from-url")
const urls = require("urls")
const createTitleBar = require("../title-bar")
const movementButtons = require("./movement-buttons")
const isButton = require("../is-button")

const titleText = (tab, prev, send) => html`
<div class="title-text">
  ${tab.isNew ? "New Tab" : prettyTitle(tab.title || tab.url) || "Loading..."}
</div>
`

const errorText = (tab, prev, send) => html`
<div class="title-text title-text-with-error">
  <span>${urls.clean(tab.webviewURL)}</span> (Failed)
</div>
`

const surfingBar = (state, prev, send) => {
  let text = titleText(state.tabs[state.tabs.selectedId], prev, send)

  if (state.tabs[state.tabs.selectedId].error) {
    text = errorText(state.tabs[state.tabs.selectedId], prev, send)
  }

  return html`
  <div class="top-bar surfing-bar">
    ${movementButtons(state, prev, send)}
    ${createTitleBar(text, onClick)(state, prev, send)}
    ${(state, prev, send)}
  </div>
  `
}

module.exports = surfingBar

function prettyTitle (original) {
  if (urls.isURL(original)) {
    return titleFromURL(original)
  }

  return original
}

function onClick (tab, state, prev, send) {
  return function (event) {
    if (isButton(event.target)) {
      return
    }

    send('search:open', { query: '', selectFirstItem: true })
  }
}
