module.exports = {
  set,
  setPrivateMode,
  setPartitionName,
  setFocusMode
}

function set (props) {
  return props
}

function setPrivateMode (value) {
  return {
    privateMode: value
  }
}

function setPartitionName (name) {
  return {
    partitionName: name
  }
}

function setFocusMode (value) {
  return {
    focusMode: value
  }
}
