const html = require('choo/html')
const format = require("format-text")
const parseURL = require('url').parse

const error6 = (props) => html`
<div><strong>${props.url}</strong> was not found.</div>
`

const error21 = (props) => html`
<div>Can not access the network. Check your internet connection please.</div>
`

const error101 = (props) => html`
<div>Can not connect to <strong>${props.hostname}</strong>. Check your connection, and reload this page later.</div>
`

const error102 = (props) => html`
<div><strong>${props.hostname}</strong> refused to connect.</div>
`

const error109 = (props) => html`
<div><strong>${props.hostname}</strong> is not available. Please check your connection and firewall.</div>
`

const error105 = (props) => html`
<div><strong>${props.hostname}</strong> can't be reached :( Are you sure it's the right address?</div>
`

const error106 = (props) => html`
It looks like you're not connected to internet currently.
`

const error501 = (props) => html`
<div><strong>${props.hostname}</strong> has tried to load insecure resources.</div>
`

const error312 = (props) => html`
<div><strong>${props.hostname}</strong> is not reachable because the port <strong>:${props.port}</strong> is not safe.</div>
`

const error324 = (props) => html`
<div><strong>${props.hostname}</strong> can't be reached :( It refused to connect. Please check your internet connection and proxy/firewall configuration.</div>
`

const crash = (props) => html`
<div><strong>${props.hostname}</strong> has just crashed.</div>
`

const generic = (props) => html`
<div><strong>${props.hostname}</strong> has generated error that Kaktüs is not familiar with yet.</div>
`

const templates = {
  '-6': error6,
  '-21': error21,
  '-101': error101,
  '-102': error102,
  '-105': error105,
  '-106': error106,
  '-109': error109,
  '-312': error312,
  '-324': error324,
  '-501': error501,
  'crash': crash
}

module.exports = render

function render (error, tab, prev, send) {
  var template = templates[error.code] || generic

  return html`
    <div class="error">
      <div class="error-info">
        <div class="big-reload-button" onclick=${reload(tab, send)}>⟳</div>
        <h1><span>Error</span></h1>
        <h2>${template(props(error, tab))}</h2>
        <h3>${error.code} - ${error.description}</h3>
      </div>
    </div>
  `
}

function props (error, tab) {
  return {
    hostname: hostname(error.url),
    port: parseURL(error.url).port,
    url: error.url,
    tab,
    error
  }
}

function reload (tab, send) {
  return function () {
    send('tabs:reload', {
      tab
    })
  }
}

function hostname (url) {
  return parseURL(url).hostname
}
