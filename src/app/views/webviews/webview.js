const html = require('choo/html')
const titleFromURL = require("title-from-url")

const webview = (state, prev, send) => {

  let tree = html`
    <webview id="${state.id}"
             class="webview active"
             src=${state.url}
             partition=${state.partitionName}></webview>
  `

  tree.addEventListener('did-start-loading', onLoadStateChange('start', state, tree, send))
  tree.addEventListener('did-stop-loading', onLoadStateChange('stop', state, tree, send))
  tree.addEventListener('did-fail-load', onLoadFails(state, tree, send))

  tree.addEventListener('crashed', onCrash(state, tree, send))
  tree.addEventListener('gpu-crashed', onCrash(state, tree, send))
  tree.addEventListener('media-started-playing', onMediaStateChange(true, state, tree, send))
  tree.addEventListener('media-paused', onMediaStateChange(false, state, tree, send))

  tree.addEventListener('page-title-updated', (event) => updateURLMeta(send, state, {
    title: event.title
  }))

  tree.addEventListener('page-favicon-updated', (event) => updateURLMeta(send, state, {
    icon: event.favicons[0]
  }))

  tree.addEventListener('will-navigate', (event) => update(send, state, {
    url: event.url,
    title: titleFromURL(event.url),
    icon: '',
    image: null,
    canGoBack: tree.canGoBack(),
    canGoForward: tree.canGoForward()
  }))

  tree.addEventListener('did-navigate', (event) =>  updateURL(send, state, event.url))
  tree.addEventListener('did-navigate-in-page', (event) => updateURL(send, state, event.url))

  tree.addEventListener('new-window', (event) => send('tabs:newTab', { url: event.url }))

  tree.addEventListener('dom-ready', (event) => {
    copyMetaInfo(state, tree, send)

    update(send, state, {
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
        //title: start ? tab.title : tree.getTitle(),
        //url: start ? tab.url : tree.getURL(),
        canGoBack: tree.canGoBack(),
        canGoForward: tree.canGoForward(),
        isLoading: start,
        isDOMReady: !start
      }
    })

    /*if (!start) {
      send(`search:quit`)
    }*/
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
