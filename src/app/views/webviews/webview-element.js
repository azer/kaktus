const html = require('choo/html')
const loop = require("parallel-loop")
const urls = require("urls")

const META_ELEMENT_SELECTORS = [
  { selector: 'og:image', prop: 'image' },
  { selector: 'og:description', prop: 'description' },
  { selector: 'keywords', prop: 'keywords' }
]

class WebviewElement {
  constructor(options) {
    this.id = options.id
    this.src = options.src
    this.isPrivate = !!options.private

    this.create()

    this.onOpenNewBuffer = options.onNewBuffer
    this.onContextMenu = options.onContextMenu
    this.onMetaUpdate = options.onMetaUpdate
    this.onURLUpdate = options.onURLUpdate
    this.onWebviewUpdate = options.onWebviewUpdate

    this.element.addEventListener('did-start-loading', this.onStartLoading)
    this.element.addEventListener('did-stop-loading', this.onStopLoading)
    this.element.addEventListener('did-fail-load', this.onFailLoad)
    this.element.addEventListener('crashed', this.onCrash)
    this.element.addEventListener('gpu-crashed', this.onCrash)

    this.element.addEventListener('media-started-playing', this.onMediaStart)
    this.element.addEventListener('media-paused', this.onMediaPause)

    this.element.addEventListener('page-title-updated', this.onTitleUpdated)
    this.element.addEventListener('page-favicon-updated', this.onIconUpdated)
    this.element.addEventListener('will-navigate', this.onNavigateOut)
    this.element.addEventListener('did-navigate', this._onURLUpdate)
    this.element.addEventListener('did-navigate-in-page', this._onURLUpdate)

    this.element.addEventListener('new-window', this.onOpenNewBuffer)
    this.element.addEventListener('dom-ready', this.onReady)
    this.element.addEventListener('ipc-message', this.onMessage)
  }

  create () {
    this.element = this.el()
    this.dom = this.isPrivate ? this.privateWrapper(this.element) : this.element
  }

  el () {
    const id = this.isPrivate ? `${this.id}-private` : this.id

    return html`
  <webview id="${id}"
           class="webview"
           src="${this.src}"
           partition=${this.options.partition}
           preload="./preload.js"></webview>`
  }

  getMetaProp (selector, callback) {
    this.element.executeJavaScript(`document.querySelector("meta[property='${selector}']") && document.querySelector("meta[property='${selector}']").getAttribute('content')`, false, (result) => {
      if (!result) return callback()

      callback(undefined, result)
    })
  }

  getMetaProps (callback) {
    const self = this
    const url = urls.clean(this.element.getURL())
    const result = {
      url,
      props: {}
    }

    loop(META_ELEMENT_SELECTORS.length, each, errors => {
      if (errors) return callback(errors[0])
      callback(undefined, result)
    })

    function each (done, index) {
      const row = META_ELEMENT_SELECTORS[index]
      self.getMetaProp(row.selector, (error, value) => {
        if (error) return callback(error)
        result.props[row.prop] = value
        done()
      })
    }
  }

  privateWrapper (children) {
    return html`
<div class="private-mode-wrapper">
  ${children}
</div>`
  }

  sendWebviewUpdates () {
    this.onWebviewUpdate({
      url: this.element.getURL(),
      canGoBack: this.element.canGoBack(),
      canGoForward: this.element.canGoForward(),
      isLoading: this.element.isLoading(),
      isMuted: this.element.isAudioMuted()
    })
  }

  onStartLoading (event) {
    this.onWebviewUpdate({
      canGoBack: this.element.canGoBack(),
      canGoForward: this.element.canGoForward(),
      isLoading: true,
      isDOMReady: false
    })
  }

  onStopLoading (event) {
    this.onWebviewUpdate({
      canGoBack: this.element.canGoBack(),
      canGoForward: this.element.canGoForward(),
      isLoading: false,
      isDOMReady: true
    })
  }

  onFailLoad (event) {
    if (event.errorCode == -3 || event.errorCode == 0) return

    if (!event.isMainFrame) {
      console.error('Ignoring an error.', event.errorCode, event.errorDescription, event.validatedURL)
      return
    }

    this.onURLUpdate(event.validatedURL)

    this.onMetaUpdate({
      icon: '',
      image: null
    })

    this.onWebviewUpdate({
      isLoading: false,
      canGoBack: this.element.canGoBack(),
      canGoForward: this.element.canGoForward(),
      error: {
        code: event.errorCode,
        description: event.errorDescription,
        url: event.validatedURL
      }
    })
  }

  onCrash (event) {
    this.onWebviewUpdate({
      isLoading: false,
      error: {
        code: 'crash',
        description: ''
      }
    })
  }

  onMediaStart (event) {
    this.onWebviewUpdate({
      isPlayingMedia: true
    })
  }

  onMediaStop (event) {
    this.onWebviewUpdate({
      isPlayingMedia: true
    })
  }

  onTitleUpdated (event) {
    this.onMetaUpdate({ title: event.title })
  }

  onIconUpdated (event) {
    this.onMetaUpdate({ icon: event.favicons[0] })
  }

  onNavigateOut (event) {
    this.onURLUpdate(event.url)

    this.onMetaUpdate({
      icon: '',
      image: null
    })

    this.sendWebviewUpdates()
  }

  onURLUpdate (event) {
    this.sendWebviewUpdates()

    this.onBufferUpdate({
      id: this.id,
      props: {
        protocol: urls.protocol(event.url),
        url: urls.clean(event.url)
      }
    })
  }

  onMessage (event) {
    if (event.channel === 'context-menu') {
      return this.onContextMenu(event)
    }
  }

  onReady (event) {
    this.getMetaProps((error, payload) => {
      if (error) return console.error('can not get meta props', error)
      this.onMetaUpdate(payload)
    })

    this.onWebviewUpdate({
      id: this.id,
      props: {
        isReady: true
      }
    })
  }
}

module.exports = WebviewElement;
