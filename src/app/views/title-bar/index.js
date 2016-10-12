const html = require('choo/html')
const icon = require("./page-icon")
const titleFromURL = require("title-from-url")
const likeButton = require("./like-button")
const createTabButton = require("./create-tab")
const findInPageBar = require("../find-in-page").bar
const privateModeIcon = require("./private-mode-icon")
const urls = require("../../urls")

module.exports = createTitleBar

function createTitleBar (children, onClick) {
  return (state, prev, send) => {
    if (state.findInPage.enabled) return findInPageBar(state, prev, send)

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
  if (state.tabs[state.tabs.selectedId].isNew) return null
  if (state.search.isOpen) {
    return createTabButton(state, prev, send)
  }

  if (isPrivateModeEnabled(state)) return privateModeIcon(state, prev, send)

  return likeButton(state, prev, send)
}

function isPrivateModeEnabled (state, prev, send) {
  const domain = state.domains[urls.domain(state.tabs[state.tabs.selectedId].url)]
  return state.general.privateMode || ( domain && domain.privateMode )
}
