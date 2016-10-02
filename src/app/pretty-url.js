module.exports = prettyURL;

function prettyURL (url) {
  return url.replace(/^\w+:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\?.*$/, '')
            .replace(/\#.*$/, '')
            .replace(/\/$/, '')
}
