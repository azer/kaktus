module.exports = {
  isUnique,
  isValid
}

function isValid (row) {
  return !!row.record
}

function isUnique () {
  const dict = {}
  return (row) => {
    if (!row || !row.url || dict[row.url]) return false
    dict[row.url] = true
    return true
  }
}
