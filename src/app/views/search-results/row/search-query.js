const html = require('choo/html')
const urls = require("urls")
const closeButton = require("./close-button")
const select = require("./on-select")(_select)
const openInNewTabButton = require("./open-in-new-tab-button")

const searchQuery = (row, state, prev, send) => html`
<div class="row history ${state.search.preview === row ? 'selected' : ''}"
     onmouseover=${setPreview(row, prev, send)}
     onclick=${select(row, prev, send)}>
  <div class="row-text">
    <div class="search-row-icon">
      <i class="fa fa-search" aria-hidden="true"></i>
    </div>
    <div class="row-text-wrapper">${title(row.search.query)}</div>
  </div>
  ${state.search.preview === row && !state.tabs[state.tabs.selectedId].isNew ? openInNewTabButton(row, prev, send) : null}
</div>
`

module.exports = searchQuery

function setPreview (row, prev, send) {
  return function () {
    send('search:setPreview', row)
  }
}

function _select (row, prev, send) {
  let url = `http://google.com/search?q=${row.search.query}`

  send('tabs:go', {
    url: urls.isURL(row.search.query) ? row.search.query : url
  })
}

function title (query) {
  if (urls.isURL(query)) {
    query = urls.clean(query)
  }

  return query
}
