module.exports = get

function get () {
  return {
    canGoBack: false,
    canGoForward: false,
    error: null,
    isDOMReady: false,
    isPlayingMedia: false,
    isLoading: false,
    isMuted: false,
    zoomLevel: 0,
    partition: ''
  }
}
