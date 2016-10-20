module.exports = {
  clean,
  meta,
  protocol,
  domain,
  normalize,
  isURL
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
  return !isURL(input.trim())
}

function isURL (input) {
  return input.indexOf(' ') === -1 && (/^\w+:\/\//.test(input) || input.indexOf('.') > 0 || input.indexOf(':') > 0)
}
