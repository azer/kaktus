const html = require('choo/html')
const preview = require("../preview")
const closeButton = require("./close-button")
const openInNewTabButton = require("./open-in-new-tab-button")
const isButton = require("../is-button")

const tabSeparator = createSeparator({ title: 'Tabs', icon: 'bars' })
const historySeparator = createSeparator({ title: 'History', icon: 'file-o'  })
const likeSeparator = createSeparator({ title: 'Liked', icon: 'heart'  })


const results = (state, prev, send) => {
  const rows = addSeparators(filter(state.search.results))

  if (rows.length === 0) return null // noresults(state, prev, send)

  return html`
  <div class="search-results">
    <div class="rows">
      ${rows.map(row => rowView(row, state, prev, send))}
    </div>
    ${preview(state, prev, send)}
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

  if (row.separator) return separatorView(row, state, prev, send)

  if (row.tab && state.tabs[row.tab.id] === null) {
    console.error('Bad tab row', state.tabs, row.tab.id)
    return null
  }

  return html`
    <div class="row ${row.tab ? 'tab' : ''} ${isSelected ? 'selected' : ''}"
         onmouseover=${setPreview(row, prev, send)}
         onclick=${select(row, state.tabs[state.tabs.selectedId], prev, send)}>
      <div class="row-text" style="background-image:url(${rowIconURL(row)})">
        ${rowIcon(row, state, prev, send)}
        <div class="row-text-wrapper">${rowTitle(row)}</div>
      </div>
      ${row.tab && isSelected ? closeButton(row.tab, prev, send) : null}
      ${!row.tab && isSelected ? openInNewTabButton(row, prev, send) : null}
    </div>
  `
}

const separatorView = (row, state, prev, send) => {
  return (row.tab ? tabSeparator : row.like ? likeSeparator : historySeparator)(state, prev, send)
}

const likedRowIcon = (state, prev, send) => html`
<div class="search-row-icon">
  <i class="fa fa-heart" aria-hidden="true"></i>
</div>`

const historicalRowIcon = (state, prev, send) => html`
<div class="search-row-icon">
  <i class="fa fa-file-o" aria-hidden="true"></i>
</div>`

module.exports = results

function rowTitle (row) {
  return row.title || ''
}

function rowIcon (row, state, prev, send) {
  if (row.tab) return null
  return (state.likes[row.url] ?  likedRowIcon : historicalRowIcon)(row, prev, send)
}

function rowIconURL (row) {
  if (!row.tab) return ''

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

function createSeparator (options) {
  return function (state, prev, send) {
    return html`<div class="separator ${options.class || ''}">
      <i aria-hidden="true" class="fa fa-${options.icon}"></i> ${options.title}
    </div>`
  }
}

function addSeparators (rows) {
  const result = []
  let last = null

  for (let row of rows) {
    if (last === null && row.isTabRecord) {
      result.push({ separator: true, tab: true })
    }

    if ((last && last.isTabRecord && row.isLikeRecord) || (last === null && row.isLikeRecord)) {
      result.push({ separator: true, like: true })
    }

    if ((last && !last.isHistoryRecord && row.isHistoryRecord) || (last === null && row.isHistoryRecord)) {
      result.push({ separator: true, history: true })
    }

    result.push(row)
    last = row
  }

  return result
}
