module.exports = {
  isUnique,
  isValidMeta,
  isValidRecord,
  isNotPrivate
}

function isValidMeta (row) {
  return !!row.record && isNotPrivate(row)
}

function isValidRecord (row) {
  return !!row.meta && isNotPrivate(row)
}

function isNotPrivate (row) {
  return !row.domain || !row.domain.privateMode
}

function isUnique () {
  const dict = {}
  return (row) => {
    if (!row || !row.url || dict[row.url]) return false
    dict[row.url] = true
    return true
  }
}
