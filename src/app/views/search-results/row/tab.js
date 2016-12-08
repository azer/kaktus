const html = require('choo/html')
const closeButton = require("./close-button")
const select = require("./on-select")(_select)

const tab = (row, state, prev, send) => html`
<div class="row tab ${state.search.preview === row ? 'selected' : ''}"
     onmouseover=${setPreview(row, prev, send)}
     onclick=${select(row, prev, send)}>
  <div class="row-text" style="background-image:url(${row.icon})">
    <div class="row-text-wrapper">${row.title || row.url}</div>
  </div>
  ${row.tab && !row.isNew ? closeButton(row.tab, prev, send) : null}
</div>
`

module.exports = ifNotNew

function ifNotNew (row, state, prev, send) {
  return tab(row, state, prev, send)
}

function setPreview (row, prev, send) {
  return function () {
    if (row.tab.isNew) return
    send('search:setPreview', row)
  }
}

function _select (row, prev, send) {
  send('tabs:select', row.tab.id)
}
