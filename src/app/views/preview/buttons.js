const html = require('choo/html')
const button = require("./button")
const urls = require("../../urls")

const likeButton = button({ title: 'Like', 'icon': 'heart', onclick: like })
const unlikeButton = button({ title: 'Liked', classes: ['active'], icon: 'heart', onclick: unlike })
const enablePrivateModeButton = button({ title: 'Private Mode', icon: 'user-secret', onclick: enablePrivateMode })
const disablePrivateModeButton = button({ title: 'Private Mode', classes: ['active'], icon: 'user-secret', onclick: disablePrivateMode })
const removeFromHistoryButton = button({ title: 'Remove From History', icon: 'trash-o', onclick: removeFromHistory })
const muteButton = button({ title: 'Mute', icon: 'volume-off', onclick: mute })
const unmuteButton = button({ title: 'Unmute', icon: 'volume-up', onclick: unmute })
const openInNewTabButton = button({ title: 'Open In New Tab', icon: 'plus', onclick: openInNewTab })
const openButton = button({ title: 'Open', icon: 'link', onclick: openInSameTab })
const closeTabButton = button({ title: 'Close', icon: 'close', onclick: closeTab })
const copyURLButton = button({ title: 'Copy URL', icon: 'copy', onclick: copyURL })

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
    openButton,
    openInNewTabButton,
    state.likes[state.search.preview.url] ? unlikeButton : likeButton,
    domain && domain.privateMode ? disablePrivateModeButton : enablePrivateModeButton,
    copyURL,
    removeFromHistoryButton
  ]
}

function tabButtons (state) {
  const domain = state.domains[urls.domain(state.search.preview.url)]

  return [
    state.likes[state.search.preview.url] ? unlikeButton : likeButton,
    domain && domain.privateMode ? disablePrivateModeButton : enablePrivateModeButton,
    closeTabButton,
    muteButton,
    copyURL
  ]
}

function like (row, prev, send) {
  send('likes:like', row.url)
}

function unlike (row, prev, send) {
    send('likes:unlike', row.url)
}

function enablePrivateMode (row, prev, send) {
  send('domains:enablePrivateMode', row.url, send)
}

function disablePrivateMode (row, prev, send) {
  send('domains:disablePrivateMode', row.url, send)
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

function closeTab (row, prev, send) {
  send('tabs:close', row.tabId)
}

function copyURL () {

}
