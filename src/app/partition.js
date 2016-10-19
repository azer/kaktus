const urls = require("./urls")

const DEV_MODE = process.env.DEV_MODE === 'ON'
const DEFAULT = 'persist:kaktus-v1'
const DEV = 'persist:kaktus-v1-dev'
const PRIVATE = 'kaktus-private'

module.exports = {
  window: name,
  tab,
  webviewId,
  isPrivateModeDomain
}

function name (isPrivate) {
  if (isPrivate) return `${PRIVATE}-${Math.floor(Math.random() * 999999)}`
  return DEV_MODE ? DEV : DEFAULT
}

function tab (t, state) {
  if (state.general.privateMode) return state.general.partitionName
  return name(isPrivateModeDomain(t || state.tabs[state.tabs.selectedId], state))
}

function webviewId (t, state) {
  return `${t.id}${isPrivateModeDomain(t, state) ? '-private' : ''}`
}

function isPrivateModeDomain (tab, state) {
  const domain = state.domains[urls.domain(tab.url)]
  return domain && domain.privateMode
}
