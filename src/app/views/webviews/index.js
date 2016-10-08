const html = require('choo/html')
const listOfTabs = require("../../list-of-tabs")
const content = require("./content")
const urls = require("../../urls")

const webviews = (state, prev, send) => html`
<div class="contents">
  ${listOfTabs(state, true).map(f => {
    if (!f) return html`<div class="content killed"></div>`
    f.isSelected = f.id === state.tabs.selectedId
    f.partitionName = isPrivateModeEnabled(state) ? 'kaktus-private' : state.general.partitionName
    return content(f, prev, send)
  })}
</div>
`

module.exports = webviews

function isPrivateModeEnabled (state, prev, send) {
  const domain = state.domains[urls.domain(state.tabs[state.tabs.selectedId].url)]
  return domain && domain.privateMode
}
