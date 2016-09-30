module.exports = {
  clean,
  meta,
  protocol
};

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
