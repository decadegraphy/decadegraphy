import React from 'react'
import moment from 'moment'
import Helpers from '../../../helpers.js'
import { connect } from 'react-redux'
import dispatch from 'store'
import * as events from 'events.js'

import CountryCityComponent from './CountryCityComponent'
import ScheduleComponent from './ScheduleComponent'
import ParticipantFields from './ParticipantFields'
import PhotographerFields from './PhotographerFields'
import VolunteerFields from './VolunteerFields'

moment.locale('zh-CN')

class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stepIndex: 0,
      twitterId: null,
      inputWords: 0,
      formData: {}
    }
  }

  componentDidUpdate (prevProps, prevState) {
    window.localStorage.state = JSON.stringify(this.state)
  }

  componentDidMount () {
    let stateCache = window.localStorage.getItem('state'),
      state = JSON.parse(stateCache) || {}

    Helpers.getJSON('/api/users/auth/', (response) => {
      this.setState({twitterId: response.username ? response.username : null})
    })

    if (stateCache !== null) {
      this.setState(state, () => {
        this._switchStep(0)
      })
    }
  }

  _choiceRoles (role, event) {
    dispatch({
      type: events.SIGNUP_TOGGLE_ROLE,
      payload: { role: role, checked: event.currentTarget.checked }
    })
  }

  _switchStep (n, e) {
    let formElements = this.refs.form.querySelectorAll('input, textarea, select'),
      newStepIndex = this.state.stepIndex + n,
      fields = this.refs.fieldsArray.children,
      stateCache = window.localStorage.getItem('state'),
      state = JSON.parse(stateCache) || {},
      name

    for (let i = 0; i < fields.length; i++) {
      fields[i].style.display = (i === newStepIndex - 1) ? '' : 'none'
    }

    for (let i = 0; i < formElements.length; i++) {
      name = formElements[i].name
      if (state.hasOwnProperty('formData') && state.formData.hasOwnProperty(name)) {
        formElements[i].value = state.formData[name]
      }

      if (['twitter_id', 'password', 'country', 'region'].indexOf(name) === -1) {
        formElements[i].addEventListener('change', this._cacheForm.bind(this))
      }
    }

    this.setState({stepIndex: newStepIndex})
  }

  _cacheForm (e) {
    let formData = this.state.formData,
      name = e.target.name

    formData[name] = e.target.value
    this.setState({formData: formData})
  }

  _submit (e) {
    e.preventDefault()
    let data = Helpers.serializeForm(this.refs.form),
      scheduleBin

    ['photographer', 'participant', 'volunteer'].forEach((role) => {
      if (data.hasOwnProperty(role + '_schedule')) {
        scheduleBin = [...Array(28).keys()].map(k => (data[role + '_schedule'].indexOf(k.toString()) === -1) ? '0' : '1').join('')
        data[role + '_schedule'] = parseInt(scheduleBin, 2)
      }
    })

    // Save citys
    if (data.hasOwnProperty('participant_country')) {
      data['participant_optional_cities'] = JSON.stringify(data.participant_country.map((country, i) => {
        return [country, data.participant_region[i], data.participant_city[i]]
      }))
    }
    data['photographer_optional_city'] = JSON.stringify([data.photographer_country, data.photographer_region, data.photographer_city])

    Helpers.post('/api/campaigns/applicants/', data, (response, xhr) => {
      if (xhr.status === 200) {
        window.location.href = this.props.messageURL('success')
        this.refs.form.reset()
      } else {
        alert(JSON.stringify(response))
      }
    })
  }

  _selectedRoleNames () {
    const roleNames = {
      photographer: '摄影师',
      model: '模特',
      volunteer: '志愿者'
    }

    return Object.keys(roleNames)
      .filter(role => this.props.roles[role])
      .map(role => roleNames[role])
  }

  render () {
    let fieldsArray = [<PhotographerFields key="1" />, <ParticipantFields key="2" />, <VolunteerFields key="3" />].filter((f, i) => this.props.legacyRolesArray.indexOf(i + 1) !== -1)

    return (
      <div className="sign-up">
        <h1 className="dg-enroll-title">Decadegraphy活动报名</h1>
        <div className="page-one" hidden={this.state.stepIndex !== 0}>
          <h2 className="subtitle"><b>你</b>想作为 _<span style={{textDecoration: 'underline'}}>{this._selectedRoleNames().join('，')}</span>_ 参与这个活动<span className="notice">请选择角色</span></h2>
          <div className="form-item-group">
            <p><label><input checked={this.props.roles['photographer']} type="checkbox" onClick={this._choiceRoles.bind(this, 'photographer')} />摄影师，用图像记录其他推友</label></p>
            <p><label><input checked={this.props.roles['model']} type="checkbox" onClick={this._choiceRoles.bind(this, 'model')} />模特，让摄影师拍摄你的现在与未来</label></p>
            <p><label><input checked={this.props.roles['volunteer']} type="checkbox" onClick={this._choiceRoles.bind(this, 'volunteer')} />志愿者，作为活动的幕后人员</label></p>
          </div>
          <a className="dg-button" hidden={this._selectedRoleNames.length === 0} onClick={this._switchStep.bind(this, 1)}>下一步</a>
        </div>

        <form ref="form" onSubmit={this._submit.bind(this)}>
          <input name="roles" type="hidden" value={this.props.legacyRolesArray.join(',')} />
          <fieldset className="fill-role-info" hidden={this.state.stepIndex === 0}>
            <h2 className="subtitle">作为{this.props.roleNames[this.props.legacyRolesArray[this.state.stepIndex - 1] - 1]}的你，</h2>
            <p className="field-item"><label><span className="field-name">*Twitter ID:</span><input className="field" type="text" name="twitter_id" value={this.state.twitterId || ''} hidden />{!this.state.twitterId ? <a className="bind-twitter" href="/accounts/twitter/login/?process=login">绑定推特账号</a> : <span className="twitter-name">@{this.state.twitterId}</span>}</label></p>
            <p className="dg-cf field-item"><label><span className="field-name special primary-place">*所在地/首选拍摄地:</span><CountryCityComponent /></label></p>

            <div ref="fieldsArray">{fieldsArray}</div>

            <p className="field-item"><label><span className="field-name">*邮箱:</span><input className="field" type="email" name="email" required /></label></p>
            <p className="field-item"><label><span className="field-name">*密码:</span><input className="field" type="password" name="password" required /></label></p>
            <p className="field-item"><label><span className="field-name">*微信号:</span><input className="field" type="text" name="wechat_id" required /></label></p>
            <p className="field-item"><label><span className="field-name">手机号:</span><span className="tel-content">+<input type="number" defaultValue="86" name="statecode" className="state-code" min="1" /><input className="field" type="number" name="mobile" className="field field-mobile" min="1" /></span></label></p>
            <p className="field-item">
              <label>
                <span className="field-name">年龄:</span>
                <select name="age" className="select-age">
                  <option>请选择</option>
                  {this.props.ages.map((age, i) => <option key={i} value={age}>{age}</option>)}
                </select>
              </label>
            </p>

            <div className="field-item"><label><span className="field-name">备注:</span>
              <textarea className="note" name="note"
                onKeyDown={e => { if ((e.keyCode !== 8) && (e.target.value.length > 1400)) { return e.preventDefault() } } }
                onKeyUp={e => this.setState({inputWords: e.target.value.length}) }></textarea></label><p className="word-count">余{1400 - this.state.inputWords}字</p></div>
            <div className="dg-button-group">
              <a className="dg-button pre-step" onClick={this._switchStep.bind(this, -1)}>上一步</a>
              <a className="dg-button next-step" onClick={this._switchStep.bind(this, 1)} hidden={this.state.stepIndex === this.props.legacyRolesArray.length}>下一步</a>
              <button className="dg-button submit" hidden={this.state.stepIndex !== this.props.legacyRolesArray.length}>提交</button>
            </div>
          </fieldset>
        </form>
      </div>
    )
  }
}
SignUp.defaultProps = {
  ages: ['0-10', '11-19', '20-25', '26-30', '31-35', '36-40', '41-45', '45-50', '50-60', '60+'],
  roleNames: ['摄影师', '模特', '志愿者'],
  messageURL: (type) => `/campaigns/signup/${type}`
}

function mapStateToProps(state, props){
  const { roles } = state.campaigns

  let legacyRolesArray = []
  if (roles.photographer)
    legacyRolesArray.push(1)
  if (roles.model)
    legacyRolesArray.push(2)
  if (roles.volunteer)
    legacyRolesArray.push(3)

  return {
    roles,
    legacyRolesArray
  }
}

export default connect(mapStateToProps)(SignUp)
