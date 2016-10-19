const html = require('choo/html')
const preview = require("../preview")
const closeButton = require("./close-button")
const openInNewTabButton = require("./open-in-new-tab-button")
const isButton = require("../is-button")

const tabSeparator = createSeparator({ title: 'Tabs', icon: 'bars' })
const historySeparator = createSeparator({ title: 'Recently Visited', icon: 'file-o'  })
const likeSeparator = createSeparator({ title: 'Liked', icon: 'heart'  })
const popularSeparator = createSeparator({ title: 'Popular', icon: 'fire'  })

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

  const selectedTab = state.tabs[state.tabs.selectedId]

  return html`
    <div class="row ${row.tab ? 'tab' : ''} ${isSelected ? 'selected' : ''}"
         onmouseover=${setPreview(row, prev, send)}
         onclick=${select(row, state.tabs[state.tabs.selectedId], prev, send)}>
      <div class="row-text" style="background-image:url(${rowIconURL(row)})">
        ${rowIcon(row, state, prev, send)}
        <div class="row-text-wrapper">${rowTitle(row)}</div>
      </div>
      ${row.tab && !row.isNew ? closeButton(row.tab, prev, send) : null}
      ${!row.tab && isSelected && !selectedTab.isNew ? openInNewTabButton(row, prev, send) : null}
    </div>
  `
}

const separatorView = (row, state, prev, send) => {
  return (row.tab ? tabSeparator : row.popular ? popularSeparator : row.like ? likeSeparator : historySeparator)(state, prev, send)
}

const likedRowIcon = (state, prev, send) => html`
<div class="search-row-icon">
  <i class="fa fa-heart" aria-hidden="true"></i>
</div>`

const historicalRowIcon = (state, prev, send) => html`
<div class="search-row-icon">
  <i class="fa fa-file-o" aria-hidden="true"></i>
</div>`

const popularRowIcon = (state, prev, send) => html`
<div class="search-row-icon">
  <i class="fa fa-fire" aria-hidden="true"></i>
</div>`

module.exports = results

function rowTitle (row) {
  return row.title || row.url || ''
}

function rowIcon (row, state, prev, send) {
  if (row.tab || row.isPopularRecord || row.like) return null
  return (state.likes[row.url] ?  likedRowIcon : historicalRowIcon)(row, prev, send)
}

function rowIconURL (row) {
  if (!row.tab && !row.isPopularRecord && !row.like) return ''

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
    return el.url
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
  let historySeparator = false
  let likeSeparator = false
  let tabSeparator = false
  let popularSeparator = false

  for (let row of rows) {
    if (row.tab && !tabSeparator) {
      tabSeparator = true
      result.push({ separator: true, tab: true })
    } else if (!row.tab && row.isPopularRecord && !popularSeparator) {
        popularSeparator = true
        result.push({ separator: true, popular: true })
    } else if (!row.tab && row.like && !likeSeparator) {
      likeSeparator = true
      result.push({ separator: true, like: true })
    } else if (!row.tab && !row.like && !row.isPopularRecord && row.record && !historySeparator) {
      historySeparator = true
      result.push({ separator: true, history: true })
    }

    result.push(row)
    last = row
  }

  return result
}
