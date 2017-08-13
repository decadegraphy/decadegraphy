import React from 'react'

import Helpers from '../../helpers.js'

let COUNTRIES = []
Helpers.getJSON('http://res.cloudinary.com/dgcdn/raw/upload/v1502605220/countries.json', (response) => { COUNTRIES = response })
class CountryCityComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      countries: [],
      regions: [],
      cities: []
    }
  }
  componentDidMount () {
    //
  }
  _selectPlace (e) {
    let code = e.target.value,
      name = e.target.name,
      regions = [],
      cnData

    if (name === 'country') {
      this.setState({regions: []})
      if (code === 'cn') {
        Helpers.getJSON('http://res.cloudinary.com/dgcdn/raw/upload/v1502605838/cn.regions.json', (response) => {
          cnData = response

          for (let province in cnData) {
            regions.push({
              code: province,
              name: cnData[province].en,
              cities: cnData[province].cities
            })
          }
          this.setState({regions})
        })
      } else {
        Helpers.getJSON('http://res.cloudinary.com/dgcdn/raw/upload/v1502605434/regions.json', (response) => {
          regions = response.filter(r => r.country === code).map(r => { return {code: r.region.toLowerCase().replace(/ /g, '-'), name: r.region} })
          this.setState({regions})
        })
      }
    }

    if (name === 'region') {
      this.setState({cities: []})
      if (this.refs.country.value === 'cn') {
        this.setState({cities: Object.values(this.state.regions.filter(r => r.code === code)[0].cities)})
      } else {
        //
      }
    }
  }

  render () {
    return (
      <div className="places">
        <select ref="country" name="country" onChange={this._selectPlace.bind(this)}>
          <option>国家/地区</option>
          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
        <select name="region" onChange={this._selectPlace.bind(this)}>
          <option>省/州</option>
          {this.state.regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        <select name="city">
          <option>市/县</option>
          {this.state.cities.map((c, i) => <option key={i}>{c.en}</option>)}
        </select>
      </div>
    )
  }
}

class ParticipantFields extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      extraOptionalPlaceComponent: []
    }
  }
  _handlePlaces (action, e) {
    let extraOptionalPlaceComponent = this.state.extraOptionalPlaceComponent
    if (action === 'insert') {
      extraOptionalPlaceComponent.push(<CountryCityComponent />)
    } else if (action === 'remove') {
      extraOptionalPlaceComponent.pop(<CountryCityComponent />)
    }
    this.setState({extraOptionalPlaceComponent})
  }
  render () {
    return (
      <div>
        <label>预计拍摄时间:<input type="date" name="planned_date" placeholder="起始日期" /></label>至<input type="date" name="planned_date" placeholder="不限制则留空" />
        <label>所在地:</label>
        <CountryCityComponent />

        <label>备选拍摄地:</label>
        <div ref="optionalPlaces"></div>
        <CountryCityComponent />

        {this.state.extraOptionalPlaceComponent.map(c => (c))}
        <span style={{display: (this.state.extraOptionalPlaceComponent.length > 1) ? 'none' : ''}} className="icon" onClick={this._handlePlaces.bind(this, 'insert')}>+</span>

        <span style={{display: (this.state.extraOptionalPlaceComponent.length === 0) ? 'none' : ''}} className="icon" onClick={this._handlePlaces.bind(this, 'remove')}>-</span>
        <label>拍摄故事:<textarea></textarea></label>
      </div>
    )
  }
}

class PhotographerFields extends React.Component {
  render () {
    return (
      <div>
        <label>可拍摄时段(如果不确定，可以选择全天):</label>
        <label>所在地:</label>
        <CountryCityComponent />

        <label>备选拍摄地:</label>
        <CountryCityComponent />
      </div>
    )
  }
}

class VolunteerFields extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: [
        '文案、文字编辑、活动策划',
        '平面/VI/网页/UI设计',
        '被拍者社群运营管理',
        '网站开发'
      ]
    }
  }
  render () {
    return (
      <div>
        <label>专业特长:</label>
        <select>
          <option>请选择</option>
          {this.state.options.map((o, i) => <option key={i}>{o}</option>)}
        </select>
        <label>兴趣方向:</label>
        <select>
          <option>请选择</option>
          {this.state.options.map((o, i) => <option key={i}>{o}</option>)}
        </select>
      </div>
    )
  }
}

class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stepIndex: 0,
      ages: ['0-10', '11-19', '20-25', '26-30', '31-35', '36-40', '41-45', '45-50', '50-60', '60+'],
      roleNames: ['摄影师', '模特', '志愿者'],
      roles: [],
      countries: [],
      cities: []
    }
  }

  componentDidMount () {
    //
  }
  _choiceRoles (i, e) {
    let roles = this.state.roles,
      stateIndex = roles.indexOf(i),
      roleId = parseInt(i)

    if (stateIndex === -1) {
      roles.push(roleId)
    } else {
      roles.splice(stateIndex, 1)
    }
    roles.sort()
    this.setState({roles})
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
      <form ref="form">
        <h1 className="dg-enroll-title">Decadegraphy活动报名</h1>
        <div className="page-one" hidden={this.state.stepIndex !== 0}>
          <h2 className="subtitle"><b>你</b>想作为 _<span style={{textDecoration: 'underline'}}>{this.state.roles.map(role => this.state.roleNames[role - 1]).join(', ')}</span>_ 参与这个活动<span className="notice">请选择角色</span></h2>
          <div className="form-item-group">
            <label><input type="checkbox" onClick={this._choiceRoles.bind(this, 1)} />摄影师，用图像记录其他推友</label>
            <label><input type="checkbox" onClick={this._choiceRoles.bind(this, 2)} />模特，让摄影师拍摄你的现在与未来</label>
            <label><input type="checkbox" onClick={this._choiceRoles.bind(this, 3)} />志愿者，作为活动的幕后人员</label>
          </div>
          <a className="dg-button" hidden={this.state.roles.length === 0} onClick={e => this.setState({stepIndex: 1})}>下一步</a>
        </div>

        <fieldset hidden={this.state.stepIndex === 0}>
          <h2>作为{this.state.roleNames[this.state.roles[this.state.stepIndex - 1] - 1]}的你，</h2>
          <label>Twitter ID:<input type="text" name="twitter_id" /></label>
          <label>Email:<input type="email" name="email" /></label>
          <label>密码:<input type="password" name="password" /></label>

          <label>微信号:<input type="text" name="wechat_id" /></label>
          <label>手机号:<input type="text" name="mobile" /></label>

          <label>年龄:</label>
          <select name="age">
            {this.state.ages.map((age, i) => <option key={i} value={age}>{age}</option>)}
          </select>
          {[<ParticipantFields />, <PhotographerFields />, <VolunteerFields />][this.state.roles[this.state.stepIndex - 1] - 1]}

          <label>备注:<textarea></textarea></label>
          <a className="button" onClick={e => this.setState({stepIndex: this.state.stepIndex - 1})}>上一步</a>
          <a className="button" onClick={e => this.setState({stepIndex: this.state.stepIndex + 1})} hidden={this.state.stepIndex === this.state.roles.length}>下一步</a>
          <button onClick={this._submit.bind(this)} hidden={this.state.stepIndex !== this.state.roles.length}>提交报名，获取二维码</button>
        </fieldset>
      </form>
    )
  }
}

export default SignUp
