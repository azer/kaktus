const html = require('choo/html')
const closeButton = require("./close-button")
const select = require("./on-select")(_select)
const openInNewTabButton = require("./open-in-new-tab-button")

const like = (row, state, prev, send) => html`
<div class="row like ${state.search.preview === row ? 'selected' : ''}"
     onmouseover=${setPreview(row, prev, send)}
     onclick=${select(row, state, prev, send)}>
  <div class="row-text" style="background-image:url(${row.icon})">
    <div class="row-text-wrapper">${row.title || row.url}</div>
  </div>
  ${state.search.preview === row && !state.tabs[state.tabs.selectedId].isNew ? openInNewTabButton(row, prev, send) : null}
</div>
`

module.exports = like

function setPreview (row, prev, send) {
  return function () {
    send('search:setPreview', row)
  }
}

function _select (row, state, prev, send) {
  send('tabs:go', {
    url: `${row.record.protocol}://${row.record.url}`
  })
}
