import React from 'react'
import Helpers from '../../helpers.js'

import SignUp from './SignUp.js'

class Message extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      roles: [],
      cities: []
    }
  }

  componentDidMount () {
    Helpers.getJSON('/api/users/auth/', (response) => {
      if (response.hasOwnProperty('id')) {
        Helpers.getJSON(`/api/campaigns/applicants/?user=${response.id}`, (response) => {
          let data = response.results[0]
          if (data) {
            this.setState({
              roles: data.roles.split(','),
              cities: data.cities
            })
          }
        })
      } else {
        window.localStorage.removeItem('state')
        window.location.href = '/campaigns/signup'
      }
    })
  }

  render () {
    let roleNames = SignUp.defaultProps.roleNames
    return (
      <div className="enroll-success">
        <img src="" alt="" className="success-icon" />
        <div className="content">
          <p>报名成功</p>
          <p>您的身份是：{this.state.roles.map(r => roleNames[r - 1]).join('，')}</p>
          <p>1. 进群前请先阅读<a href="#">活动流程指引与约拍须知</a></p>
          <p>2. 扫描下方二维码加入城市拍摄微信群，开始你的Decadegraphy旅程</p>
          <ul className="qrcode">
            {this.state.cities.map((city, i) => <li key={i}><img src="" alt="" /><span>{city}交流群</span></li>)}
          </ul>
        </div>
      </div>
    )
  }
}

export default Message
