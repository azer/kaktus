module.exports = listOfTabs
module.exports.allOpenTabs = allOpenTabs

function listOfTabs (state, includeClosedRows) {
  state = state.tabs || state
  let result = []

  for (let key in state) {
    if (/^f-/.test(key) && (state[key] || includeClosedRows)) {
      result.push(state[key])
    }
  }

  return result
}

function allOpenTabs (state) {
  return listOfTabs(state).filter(isNotNew)
}

function isNotNew (tab) {
  return !tab.isNew
}
