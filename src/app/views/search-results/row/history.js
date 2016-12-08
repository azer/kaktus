const html = require('choo/html')
const closeButton = require("./close-button")
const select = require("./on-select")(_select)
const openInNewTabButton = require("./open-in-new-tab-button")

const history = (row, state, prev, send) => html`
<div class="row history ${state.search.preview === row ? 'selected' : ''}"
     onmouseover=${setPreview(row, prev, send)}
     onclick=${select(row, prev, send)}>
  <div class="row-text">
    <div class="search-row-icon">
      <i class="fa fa-file-o" aria-hidden="true"></i>
    </div>
    <div class="row-text-wrapper">${row.title || row.url}</div>
  </div>
  ${state.search.preview === row && !state.tabs[state.tabs.selectedId].isNew ? openInNewTabButton(row, prev, send) : null}
</div>
`

module.exports = history

function setPreview (row, prev, send) {
  return function () {
    send('search:setPreview', row)
  }
}

function _select (row, prev, send) {
  send('tabs:go', {
    url: `${row.record.protocol}://${row.record.url}`
  })
}
