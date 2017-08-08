import React from 'react'

import Helpers from '../../helpers.js'

class SignUp extends React.Component {
  componentDidMount () {
    //
  }
  _submit (e) {
    e.preventDefault()
    // TODO: Validate
    let data = Helpers.serializeForm(this.refs.form)
    Helpers.post('/api/campaigns/applicants/', data, (response) => {
      this.refs.form.reset()
    })
  }
  render () {
    return (
      <div>
        <form ref="form">
          <label><input name="email" placeholder="Email" /></label>
          <button onClick={this._submit.bind(this)}>Submit</button>
        </form>
      </div>
    )
  }
}

export default SignUp
