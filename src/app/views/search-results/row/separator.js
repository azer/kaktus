const html = require('choo/html')
const tab = createSeparator({ title: 'Tabs', icon: 'bars' })
const history = createSeparator({ title: 'Recently Visited', icon: 'file-o'  })
const like = createSeparator({ title: 'Liked', icon: 'heart'  })
const popular = createSeparator({ title: 'Popular', icon: 'fire'  })
const search = createSeparator({ title: 'Search Suggestions', icon: 'search'  })

module.exports = show

function show (row, state, prev, send) {
  return pick(row)(state, prev, send)
}

function pick (row) {
  if (row.tab) return tab
  if (row.like) return like
  if (row.popular) return popular
  if (row.search) return search
  return history
}

function createSeparator (options) {
  return function (state, prev, send) {
    return html`<div class="separator ${options.class || ''}">
      <i aria-hidden="true" class="fa fa-${options.icon}"></i> ${options.title}
    </div>`
  }
}
