const html = require('choo/html')
const prettyURL = require("../../../pretty-url")
const buttons = require("./buttons")

const image = (state, prev, send) => html`
<div class="preview-image">
  <img src="${fixImageURL(state.search.preview.image || state.search.preview.icon)}" />
</div>
`
const preview = (state, prev, send) => html`
<div class="preview">
  ${state.search.preview.image || state.search.preview.icon ? image(state, prev, send) : null}
  <div class="preview-text">${state.search.preview.title}</div>
  <div class="preview-url">${state.search.preview.url}</div>
  ${buttons(state, prev, send)}
</div>
`

module.exports = preview

function fixImageURL (url) {
  if (/^\w+:\/\//.test(url)) return url
  if (/^\/\//.test(url)) return `http:${url}`
  return `http://${url}`
}
