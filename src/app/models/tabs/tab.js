const titleFromURL = require("title-from-url")
const parseURL = require("url").parse

class Tab {
  constructor (id, url, options) {
    this.id = id
    this.url = url.trim()
    this.title = titleFromURL(this.url)
    this.description = ''
    this.icon = null
    this.image = undefined
    this.error = null

    this.createdAt = Date.now()
    this.seenAt = 0

    this.canGoBack = false
    this.canGoForward = false
    this.isDOMReady = false
    this.isLiked = false
    this.isLoading = false
    this.isSelected = false
    this.isPlayingMedia = false
    this.isNew = url.trim() === ''
    this.isMuted = false

    this.zoomLevel = 0
  }
}

module.exports = Tab
