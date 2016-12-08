const urls = require("urls")

const DEV_MODE = process.env.DEV_MODE === 'ON'
const DEFAULT = 'persist:kaktus-v1'
const DEV = 'persist:kaktus-v1-dev'
const PRIVATE = 'kaktus-private'

module.exports = {
  window: name,
  webview,
  isPrivateModeDomain
}

function name (isPrivate) {
  if (isPrivate) return `${PRIVATE}-${Math.floor(Math.random() * 999999)}`
  return DEV_MODE ? DEV : DEFAULT
}

function webview (url, state) {
  if (state.general.privateMode) return state.general.partitionName
  return name(isPrivateModeDomain(url, state))
}

function isPrivateModeDomain (url, state) {
  const domain = state.domains[urls.domain(url)]
  return domain && domain.privateMode
}
