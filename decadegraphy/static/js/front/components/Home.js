import React from 'react'
import Helpers from '../../helpers.js'

import testWorks from '../../works.json'

class Home extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="home">
        <div className="slides">
          <ul>
            <li>你有故事，我们有镜头<br/>光和影，酸和甜，色块和黑白，被快门酿成酒。<br/>十年后，我们一起，喝个痛快。</li>
          </ul>
          <div className="slides-control">
            {[0, 1, 2].map(i => { return <a key={i} href="#{i}">●</a> })}
          </div>
        </div>
        <div className="container">
          <div className="works">
            {testWorks.map((f, i) => <div key={i} className="work"><img src={f} width="100%" /></div>)}
          </div>
        </div>
      </div>
    )
  }
}
export default Home
