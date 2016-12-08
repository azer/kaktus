module.exports = {
  setEnabled,
  setQuery
}

function setEnabled (value) {
  return {
    enabled: value
  }
}

function setQuery (value) {
  return {
    query: value
  }
}
