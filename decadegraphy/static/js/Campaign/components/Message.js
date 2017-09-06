import React from 'react'
import Helpers from '../../helpers.js'
import dispatch from 'store'
import * as events from 'events.js'
import { connect } from 'react-redux'

class Message extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      qrCodes: []
    }
  }

  componentDidMount () {
    Helpers.getJSON('/api/users/auth/', (response) => {
      if (response.hasOwnProperty('id')) {
        Helpers.getJSON(`/api/campaigns/applicants/?user=${response.id}`, (response) => {
          let data = response.results[0],
            qrCodes = []

          qrCodes.push(data.cities.user.join('-')) // Required field

          if (data.cities.optional[0]) { // photographer_optional_city
            qrCodes.push(JSON.parse(data.cities.optional[0]).join('-'))
          }
          if (data.cities.optional[1]) { // participant_optional_cities
            JSON.parse(data.cities.optional[1]).filter(c => c.length > 0).map(c => c.join('-'))
          }
          ['will', 'skill'].forEach(f => {
            if (data[f] !== null) {
              qrCodes.push(data[f])
            }
          })

          if (data) {
            dispatch({
              type: events.SIGNUP_ROLES_FETCHED,
              payload: { roles: JSON.parse(data.roles) }
            })
            this.setState({
              qrCodes
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
    const { roles } = this.props

    return (
      <div className="enroll-success">
        <img src="" alt="" className="success-icon" />
        <div className="content">
          <p>报名成功</p>
          <p>您的身份是：{Helpers.translateRoleNames(roles).join('，')}</p>
          <p>1. 进群前请先阅读<a href="#">活动流程指引与约拍须知</a></p>
          <p>2. 扫描下方二维码加入城市拍摄微信群，开始你的Decadegraphy旅程</p>
          <ul className="qrcode">
            {this.state.qrCodes.map((city, i) => <li key={i}><img src="" alt="" /><span>{city}交流群</span></li>)}
          </ul>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state, props) {
  const { roles } = state.campaigns

  return {
    roles
  }
}

export default connect(mapStateToProps)(Message)
