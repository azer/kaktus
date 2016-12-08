const html = require('choo/html')

const likeButton = (state, prev, send) => {
  const selectedTab = state.tabs[state.tabs.selectedId]
  const isLiked = !!state.likes[selectedTab.url]

  return html`
  <div title=${isLiked ? "Unlike" : "Like"} class="like-button ${isLiked ? "liked" : "" }" onclick=${toggleLike({ url: selectedTab.url, isLiked }, prev, send)}>
    <i class="fa fa-heart" aria-hidden="true"></i>
  </div>`
}

module.exports = likeButton

function toggleLike (payload, prev, send) {
  return function () {
    send(`likes:${payload.isLiked ? 'un' : ''}like`, payload.url)
  }
}
