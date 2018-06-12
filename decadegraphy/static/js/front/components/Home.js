import React from 'react'
import Helpers from '../../helpers.js'

class Home extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="home">
        <div className="slides"></div>
        <div className="container"></div>
      </div>
    )
  }
}
export default Home
