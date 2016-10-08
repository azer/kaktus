const html = require('choo/html')
const button = require("./button")
const urls = require("../../urls")

const likeButton = button('Like', 'heart', like)
const unlikeButton = button('Liked', 'heart', unlike)
const enablePrivacyModeButton = button('Privacy Mode', 'user-secret', enablePrivacyMode)
const disablePrivacyModeButton = button('Disable Privacy Mode', 'user-secret', disablePrivacyMode)
const removeFromHistoryButton = button('Remove From History', 'trash-o', removeFromHistory)
const muteButton = button('Mute', 'volume-off', mute)
const unmuteButton = button('Unmute', 'volume-up', unmute)
const openInNewTabButton = button('Open In New Tab', 'plus', openInNewTab)
const openButton = button('Open', 'link', openInSameTab)

const view = (state, prev, send) => html`
  <div class="preview-buttons">
    ${buttons(state).map(b => b(state.search.preview, prev, send))}
  </div>
`

module.exports = view

function buttons (state) {
  if (state.search.preview.tab) return tabButtons(state)

  const domain = state.domains[urls.domain(state.search.preview.url)]

  return [
    state.likes[state.search.preview.url] ? unlikeButton : likeButton,
    domain && domain.privacyMode ? disablePrivacyModeButton : enablePrivacyModeButton,
    openButton,
    openInNewTabButton,
    removeFromHistoryButton
  ]
}

function tabButtons (state) {
  const domain = state.domains[urls.domain(state.search.preview.url)]

  return [
    state.likes[state.search.preview.url] ? unlikeButton : likeButton,
    domain && domain.privacyMode ? disablePrivacyModeButton : enablePrivacyModeButton,
    muteButton
  ]
}

function like (row, prev, send) {
  send('likes:like', row.url)
}

function unlike (row, prev, send) {
    send('likes:unlike', row.url)
}

function enablePrivacyMode (row, prev, send) {
  send('domains:enablePrivacyMode', row.url, send)
}

function disablePrivacyMode (row, prev, send) {
  send('domains:disablePrivacyMode', row.url, send)
}

function removeFromHistory () {

}

function mute () {

}

function unmute () {

}

function openInNewTab (row, prev, send) {
  send('tabs:newTab', { url: row.url })
}

function openInSameTab (row, prev, send) {
  send('tabs:go', { url: row.url })
}
