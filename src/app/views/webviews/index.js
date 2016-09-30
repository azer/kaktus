const html = require('choo/html')
const listOfTabs = require("../../list-of-tabs")
const content = require("./content")

const webviews = (state, prev, send) => html`
<div class="contents">
  ${listOfTabs(state, true).map(f => {
    if (!f) return html`<div class="content killed"></div>`
    f.isSelected = f.id === state.tabs.selectedId;
    f.partitionName = state.general.partitionName;
    return content(f, prev, send)
  })}
</div>
`

module.exports = webviews
