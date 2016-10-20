const html = require('choo/html')
const preview = require("../preview")
const row = require("./row")
const addSeparators = require("./add-separators")

const list = (state, prev, send) => html`
  <div class="search-results">
    <div class="rows">
      ${addSeparators(state.search.results).map(r => row(r, state, prev, send))}
    </div>
    ${preview(state, prev, send)}
    <div class="clear"></div>
  </div>
`

module.exports = show

function show (state, prev, send) {
  if (state.search.results.length === 0) return null
  return list(state, prev, send)
}
