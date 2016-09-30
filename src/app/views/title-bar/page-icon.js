const html = require('choo/html')
const pageButtons = require("./page-buttons")

const favicon = (state, prev, send) => html`
<div class="favicon" style="background-image:url(${state.icon})"></div>
`

const spinner = (state, prev, send) => html`
<div class="spinner"></div>
`

const search = (state, prev, send) => html`
<div class="search-icon">
  <i class="fa fa-search" aria-hidden="true"></i>
</div>
`

const either = (state, prev, send) => html`
<div class="page-icon">
  ${buttons(state, prev, send)}
  ${icon(state, prev, send)}
</div>
`

module.exports = either

function icon (state, prev, send) {
  if (state.isNew) return search(state, prev, send)
  if (state.isLoading) return spinner(state, prev, send)
  return favicon(state, prev, send)
}

function buttons (state, prev, send) {
  if (state.isNew) return null
  return pageButtons(state, prev, send)
}
