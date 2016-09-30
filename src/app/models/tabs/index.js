const state = require("./state")
const reducers = require("./reducers")
const effects = require("./effects")
const listOfTabs = require("../../list-of-tabs")

module.exports = {
  namespace: 'tabs',
  state,
  reducers,
  effects,
  searchRows
}

function searchRows (state) {
  return listOfTabs(state).map(tab => {
    return {
      tab
    }
  })
}
