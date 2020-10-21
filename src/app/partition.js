const urls = require("./urls")

const DEV_MODE = process.env.DEV_MODE === 'ON'
const DEFAULT = 'persist:kaktus-v1'
const DEV = 'persist:kaktus-v1-dev'
const PRIVATE = 'kaktus-private'

module.exports = {
  window: name,
  tab,
  webviewId,
  isPrivateModeDomain,
  preferences,
  userAgent
}

function name (isPrivate) {
  if (isPrivate) return `${PRIVATE}-${Math.floor(Math.random() * 999999)}`
  return DEV_MODE ? DEV : DEFAULT
}

function tab (t, state) {
  if (state.general.privateMode) return state.general.partitionName
  return name(isPrivateModeDomain(t || state.tabs[state.tabs.selectedId], state))
}

function preferences (t, state) {
  return "javascript=no"
  return ""
}

function userAgent (t, state) {
  return "Lynx/2.8.4rel.1 libwww-FM/2.14 SSL-MM/1.4.1 OpenSSL/0.9.6c"
  return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.110 Safari/537.36"
}

function webviewId (t, state) {
  return `${t.id}${isPrivateModeDomain(t, state) ? '-private' : ''}`
}

function isPrivateModeDomain (tab, state) {
  const domain = state.domains[urls.domain(tab.url)]
  return domain && domain.privateMode
}
