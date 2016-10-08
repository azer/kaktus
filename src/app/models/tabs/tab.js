const titleFromURL = require("title-from-url")
const parseURL = require("url").parse
const urls = require("../../urls")

class Tab {
  constructor (id, protocol, url) {
    this.id = id
    this.protocol = protocol || ''
    this.url = url && url.trim() || ''
    this.webviewURL = this.protocol ? `${this.protocol}://${this.url}` : this.url
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
