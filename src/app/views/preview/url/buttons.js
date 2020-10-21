const html = require('choo/html')
const button = require("./button")
const urls = require("../../../urls")
const clipboard = electronRequire("electron").clipboard

const likeButton = button({ title: 'Like', 'icon': 'heart', onclick: like })
const unlikeButton = button({ title: 'Liked', classes: ['active'], icon: 'heart', onclick: unlike })
const enablePrivateModeButton = button({ title: 'Private Mode', icon: 'user-secret', onclick: enablePrivateMode })
const disablePrivateModeButton = button({ title: 'Private Mode', classes: ['active'], icon: 'user-secret', onclick: disablePrivateMode })
const enableNineteensModeButton = button({ title: '90s Mode', icon: 'record-vinyl', onclick: enablePrivateMode })
const disableNineteensModeButton = button({ title: '90s Mode', classes: ['nineteens-mode active'], icon: 'record-vinyl', onclick: disablePrivateMode })
const removeFromHistoryButton = button({ title: 'Remove From History', icon: 'trash-o', onclick: removeFromHistory })
const muteButton = button({ title: 'Mute', icon: 'volume-up', onclick: mute })
const unmuteButton = button({ title: 'Muted', icon: 'volume-off', onclick: unmute })
const openInNewTabButton = button({ title: 'Open In New Tab', icon: 'plus', onclick: openInNewTab })
const openButton = button({ title: 'Open', icon: 'link', onclick: openInSameTab })
const closeTabButton = button({ title: 'Close', icon: 'close', onclick: closeTab })
const copyURLButton = button({ title: 'Copy URL', icon: 'copy', onclick: copyURL })

const view = (state, prev, send) => html`
  <div class="preview-buttons">
    ${buttons(state).filter(b => !!b).map(b => b(state.search.preview, prev, send))}
  </div>
`

module.exports = view

function buttons (state) {
  if (state.search.preview.tab && state.tabs[state.search.preview.tab.id]) return tabButtons(state)

  const preview = state.search.preview
  const domain = state.domains[urls.domain(preview.url)]
  const selectedTab = state.tabs[state.tabs.selectedId]

  return [
    selectedTab.url !== preview.url ? openButton : null,
    selectedTab.isNew && selectedTab.url !== preview.url ? null : openInNewTabButton,
    state.likes[state.search.preview.url] ? unlikeButton : likeButton,
    domain && domain.privateMode ? disablePrivateModeButton : enablePrivateModeButton,
    domain && domain.privateMode ? disableNineteensModeButton : enableNineteensModeButton,
    copyURLButton
  ]
}

function tabButtons (state) {
  const domain = state.domains[urls.domain(state.search.preview.url)]
  const tab = state.tabs[state.search.preview.tab.id]

  const result = [
    state.likes[state.search.preview.url] ? unlikeButton : likeButton,
    domain && domain.privateMode ? disablePrivateModeButton : enablePrivateModeButton,
    domain && domain.privateMode ? disableNineteensModeButton : enableNineteensModeButton,
    closeTabButton
  ]

  if (tab.isPlayingMedia) {
    result.push(tab.isMuted ? unmuteButton : muteButton)
  }

  result.push(copyURLButton)

  return result
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

function mute (row, prev, send) {
  send('tabs:mute', { tabId: row.tab.id })
}

function unmute (row, prev, send) {
  send('tabs:unmute', { tabId: row.tab.id })
}

function openInNewTab (row, prev, send) {
  send('tabs:newTab', { url: row.url })
}

function openInSameTab (row, prev, send) {
  send('tabs:go', { url: row.url })
}

function closeTab (row, prev, send) {
  send('tabs:close', row.tab.id)
  send('search:setPreview', null)
}

function copyURL (row, prev, send) {
  clipboard.writeText(`${row.record.protocol}://${row.record.url}`)
}
