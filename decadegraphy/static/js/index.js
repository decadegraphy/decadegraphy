import { Router, Route } from 'react-router'
import React from 'react'
import ReactDOM from 'react-dom'

import '../css/main.css'

import createBrowserHistory from 'history/createBrowserHistory'

import * as Campaign from './Campaign'

const history = createBrowserHistory()

if (document.getElementById('app')) {
  ReactDOM.render((
    <Router history={history}>
      <Route path="/campaigns/signup" component={Campaign.SignUp}/>
    </Router>
  ), document.getElementById('app'))
}
