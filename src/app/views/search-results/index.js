const html = require('choo/html')
const preview = require("./preview")
const closeButton = require("./close-button")
const openInNewTabButton = require("./open-in-new-tab-button")
const isButton = require("../is-button")

const results = (state, prev, send) => {
  const rows = filter(state.search.results)

  if (rows.length === 0) return null // noresults(state, prev, send)

  return html`
  <div class="search-results">
    <div class="rows">
      ${rows.map(row => rowView(row, state, prev, send))}
    </div>
    ${state.search.preview ? preview(state.search.preview) : null}
    <div class="clear"></div>
  </div>
  `
}

const noresults = (state, prev, send) => {
  return html`
<div class="search-results">
  <div class="no-results">
    Nothing found for <strong>${state.search.query}</strong>
  </div>
</div>
`
}

const rowView = (row, state, prev, send) => {
  const isSelected = state.search.preview === row

  if (row.tab && state.tabs[row.tab.id] === null) {
    return null
  }

  return html`
    <div class="row ${row.tab ? 'tab' : ''} ${isSelected ? 'selected' : ''}"
         onmouseover=${setPreview(row, prev, send)}
         onclick=${select(row, state.tabs[state.tabs.selectedId], prev, send)}>
      <div class="row-text" style="background-image:url(${rowIcon(row)})">
        <div class="row-text-wrapper">${rowTitle(row)}</div>
      </div>
      ${row.tab && isSelected ? closeButton(row.tab, prev, send) : null}
      ${!row.tab && isSelected ? openInNewTabButton(row, prev, send) : null}
    </div>
  `
}

module.exports = results

function rowTitle (row) {
  return row.title || ''
}

function rowIcon (row) {
  return row.icon
}

function select (row, selectedTab, prev, send) {
  return function (event) {
    if (isButton(event.target)) {
      return
    }

    send('search:quit')

    if (row.tab) {
      return send('tabs:select', row.tab.id)
    }

    send('tabs:go', {
      url: `${row.record.protocol}://${row.record.url}`,
      tab: selectedTab
    })
  }
}

function setPreview (row, prev, send) {
  return function () {
    if (row.tab && row.tab.isNew) return
    send('search:setPreview', row)
  }
}

function filter (list) {
  return list.filter(el => {
    return el.title && el.url
  })
}
