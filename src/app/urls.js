module.exports = {
  clean,
  meta,
  protocol,
  domain,
  normalize
}

function protocol (url) {
  const match = url.match(/(^\w+):\/\//)
  if (match) {
    return match[1]
  }

  return 'http'
}

function clean (url) {
  return url
    .trim()
    .replace(/^\w+:\/\//, '')
    .replace(/(\/|\?|\&)*$/, '')
    .replace(/^www\./, '')
}

function meta (url) {
  return clean(url)
    .toLowerCase()
    .replace(/\#.*$/, '')
}

function domain (url) {
  var a = document.createElement('a')
  a.href = normalize(url)
  return a.hostname
}

function normalize (input) {
  if (isSearchQuery(input)) {
    return `https://google.com/search?q=${input}`
  }

  if (!/^\w+:\/\//.test(input)) {
    return `http://${input}`
  }

  return input
}

function isSearchQuery (input) {
  return input.indexOf(' ') > -1 || input.indexOf('.') === -1
}
