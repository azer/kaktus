const html = require('choo/html')
const titleFromURL = require("title-from-url")
const partition = require("../../partition")

const el = (tab, state, prev, send) => html`
<webview id="${partition.webviewId(tab, state)}"
         class="webview active"
         src="${tab.webviewURL}"
         partition=${partition.tab(tab, state)}></webview>
`

const webview = (tab, state, prev, send) => {
  let tree = el(tab, state, prev, send)
  tree.addEventListener('did-start-loading', onLoadStateChange('start', tab, tree, send))
  tree.addEventListener('did-stop-loading', onLoadStateChange('stop', tab, tree, send))
  tree.addEventListener('did-fail-load', onLoadFails(tab, tree, send))

  tree.addEventListener('crashed', onCrash(tab, tree, send))
  tree.addEventListener('gpu-crashed', onCrash(tab, tree, send))
  tree.addEventListener('media-started-playing', onMediaStateChange(true, tab, tree, send))
  tree.addEventListener('media-paused', onMediaStateChange(false, tab, tree, send))

  tree.addEventListener('page-title-updated', (event) => updateURLMeta(send, tab, {
    title: event.title
  }))

  tree.addEventListener('page-favicon-updated', (event) => updateURLMeta(send, tab, {
    icon: event.favicons[0]
  }))

  tree.addEventListener('will-navigate', (event) => update(send, tab, {
    url: event.url,
    title: titleFromURL(event.url),
    icon: '',
    image: null,
    canGoBack: tree.canGoBack(),
    canGoForward: tree.canGoForward()
  }))

  tree.addEventListener('did-navigate', (event) =>  updateURL(send, tab, event.url))
  tree.addEventListener('did-navigate-in-page', (event) => updateURL(send, tab, event.url))

  tree.addEventListener('new-window', (event) => send('tabs:newTab', { url: event.url }))

  tree.addEventListener('dom-ready', (event) => {
    copyMetaInfo(tab, tree, send)
    update(send, tab, {
      isDOMReady: true
    })
  })

  return tree
}

module.exports = webview

function onLoadStateChange (eventName, tab, tree, send) {
  const start = eventName === 'start'

  return function () {
    console.log(start ? 'start loading' : 'stop loading')

    send(`tabs:${eventName}Loading`, {
      tab,
      props: {
        canGoBack: tree.canGoBack(),
        canGoForward: tree.canGoForward(),
        isLoading: start,
        isDOMReady: !start
      }
    })
  }
}

function onLoadFails (tab, tree, send) {
  return function (event) {
    if (event.errorCode == -3 || event.errorCode == 0) return

    if (!event.isMainFrame) {
      console.error('Ignoring an error.', event.errorCode, event.errorDescription, event.validatedURL)
      return
    }

    send('tabs:update', {
      tab,
      props: {
        isLoading: false,
        url: event.validatedURL,
        title: titleFromURL(event.validatedURL),
        icon: '',
        image: null,
        canGoBack: tree.canGoBack(),
        canGoForward: tree.canGoForward(),
        error: {
          code: event.errorCode,
          description: event.errorDescription,
          url: event.validatedURL
        }
      }
    })
  }
}

function onCrash (tab, tree, send) {
  return function (event) {
    send('tabs:update', {
      tab,
      props: {
        isLoading: false,
        error: {
          code: 'crash',
          description: '',
          url: tab.url
        }
      }
    })
  }
}

function update(send, tab, props) {
  send('tabs:update', {
    tab,
    props
  })
}

function updateURL (send, tab, url) {
  if (tab.url === url) return console.error('The updated URL is same with existing one', url)

  send('tabs:updateURL', {
    tab,
    url
  })
}

function updateURLMeta (send, tab, props) {
  send('tabs:updateURLMeta', {
    tab,
    props
  })
}

function onMediaStateChange (isPlaying, tab, tree, send) {
  return function (event) {
    send('tabs:update', {
      tab,
      props: {
        isPlayingMedia: isPlaying
      }
    })
  }
}

function copyMetaInfo(tab, webview, send) {
  getMetaProperty(webview, 'og:image', (error, image) => {
    getMetaProperty(webview, 'og:description', (error, desc) => {
      getMetaProperty(webview, 'keywords', (error, keywords) => {

        if (!image && !desc) return

        send('tabs:updateURLMeta', {
          tab,
          props: {
            image: image || '',
            description: desc || '',
            keywords: keywords || ''
          }
        })
      })
    })
  })
}

function getMetaProperty (webview, name, callback) {
  webview.executeJavaScript(`document.querySelector("meta[property='${name}']") && document.querySelector("meta[property='${name}']").getAttribute('content')`, false, (result) => {
    if (!result) return callback()

    callback(undefined, result)
  })
}
