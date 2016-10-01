const html = require('choo/html')
const titleFromURL = require("title-from-url");
const createTitleBar = require("../title-bar")
const movementButtons = require("./movement-buttons")
const tabs = require("../../models/tabs")
const isButton = require("../is-button");


const titleText = (tab, prev, send) => html`
<div class="title-text">
  ${tab.isNew ? "New Tab" : prettyTitle(tab.title) || "Loading..."}
</div>
`

const surfingBar = (state, prev, send) => {
  const text = titleText(state.tabs[state.tabs.selectedId], prev, send)

  return html`
  <div class="top-bar surfing-bar">
    ${movementButtons(state, prev, send)}
    ${createTitleBar(text, onClick)(state, prev, send)}
    ${(state, prev, send)}
  </div>
  `
}

module.exports = surfingBar;

function prettyTitle (original) {
  if (!original || !original.trim() || /^https?:\/\//.test(original)) {
    return titleFromURL(original)
  }

  return original;
}

function onClick (tab, state, prev, send) {
  return function (event) {
    if (isButton(event.target)) {
      return
    }

    send('search:open', {
      query: tab.url,
      search: '',
      select: true
    })
  }
}
