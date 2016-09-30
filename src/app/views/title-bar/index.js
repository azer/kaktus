const html = require('choo/html')
const icon = require("./page-icon")
const titleFromURL = require("title-from-url")
const likeButton = require("./like-button")
const createTabButton = require("./create-tab")

module.exports = createTitleBar

function createTitleBar (children, onClick) {
  return (state, prev, send) => {
    const selectedTab = state.tabs[state.tabs.selectedId]

    return html`
    <div class="title-bar" onclick=${onClick && onClick(selectedTab, state, prev, send)}>
      ${icon(selectedTab, prev, send)}
      ${children}
      ${button(state, prev, send)}
    </div>`
  }
}

function button (state, prev, send) {
  const selectedTab = state.tabs[state.tabs.selectedId]

  if (selectedTab.isNew) return null

  if (state.search.isOpen) {
    return createTabButton(state, prev, send)
  }

  return likeButton(selectedTab, prev, send)
}
