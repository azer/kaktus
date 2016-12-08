const html = require('choo/html')
const urls = require("urls")

const preview = (state, prev, send) => html`
<div class="preview">
  <div class="preview-image">
    <i class="fa fa-search" aria-hidden="true"></i>
  </div>
  <div class="preview-text">Search: ${title(state.search.preview.search.query)}</div>
  <div class="preview-url">On Google</div>
</div>
`

module.exports = preview

function title (query) {
  if (urls.isURL(query)) {
    query = urls.clean(query)
  }

  return query
}
