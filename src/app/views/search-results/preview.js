const html = require('choo/html')
const prettyURL = require("../../pretty-url")

const image = (row, prev, send) => html`
<div class="preview-image">
  <img src="${fixURL(row.image || row.icon)}" />
</div>
`

const preview = (row, prev, send) => html`
<div class="preview">
  ${row.image || row.icon ? image(row, prev, send) : null}
  <div class="preview-text">${row.title}</div>
  <div class="preview-url">${row.url}</div>
</div>
`

module.exports = preview

function fixURL (url) {
  if (/^\w+:\/\//.test(url)) return url
  if (/^\/\//.test(url)) return `http:${url}`
  return `http://${url}`
}
