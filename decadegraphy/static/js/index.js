import { Router, Route } from 'react-router'
import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import * as Campaign from './Campaign'

import '../css/main.scss'

// Global JSONP handle
window.jsonp = new Proxy({}, {
  get: (self, key) => {
    return (data) => { window[key] = data }
  }
})

const history = createBrowserHistory()

if (document.getElementById('app')) {
  ReactDOM.render((
    <Router history={history}>
      {/* <Route path="/campaigns/signup" component={Campaign.SignUp}/> */}
      <Route path="/" component={Campaign.SignUp}/>
    </Router>
  ), document.getElementById('app'))
}
