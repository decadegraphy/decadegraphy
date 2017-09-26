import React from 'react'
import moment from 'moment'
import { PhoneNumberUtil } from 'google-libphonenumber'
import Helpers from '../../../helpers.js'
import { connect } from 'react-redux'
import dispatch from 'store'
import * as events from 'events.js'

import CountryCityComponent from './CountryCityComponent'
import ParticipantFields from './ParticipantFields'
import PhotographerFields from './PhotographerFields'
import VolunteerFields from './VolunteerFields'

moment.locale('zh-CN')

class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputWords: 0,
      formData: {}
    }
  }

  componentDidUpdate (prevProps, prevState) {
    window.localStorage.state = JSON.stringify(this.state)
  }

  componentDidMount () {
    const stateCache = window.localStorage.getItem('state')
    const state = JSON.parse(stateCache) || {}

    Helpers.getJSON('/api/users/auth/', (response) => {
      dispatch({
        type: events.TWITTER_ID_FETCHED,
        payload: { twitterId: response.username ? response.username : null }
      })
    })

    if (stateCache !== null) {
      this.setState(state, () => {
        this._switchStep(0)
      })
    }
  }

  _choiceRoles (role, checked) {
    dispatch({
      type: events.SIGNUP_TOGGLE_ROLE,
      payload: {
        role: role,
        checked: checked
      }
    })
  }

  _switchStep (n, e) {
    const formElements = this.refs.form.querySelectorAll('input, textarea, select')
    const newStepIndex = this.props.stepIndex + n
    const fields = this.refs.fieldsArray.children
    const stateCache = window.localStorage.getItem('state')
    const state = JSON.parse(stateCache) || {}

    for (let i = 0; i < fields.length; i++) {
      fields[i].style.display = (i === newStepIndex - 1) ? '' : 'none'
    }

    for (let i = 0; i < formElements.length; i++) {
      const name = formElements[i].name
      if (state.hasOwnProperty('formData') && state.formData.hasOwnProperty(name)) {
        formElements[i].value = state.formData[name]
      }

      if (['twitter_id', 'password', 'country', 'region'].indexOf(name) === -1) {
        formElements[i].addEventListener('change', this._cacheForm.bind(this))
      }
    }

    dispatch({
      type: events.CHANGE_STEP,
      payload: { stepIndex: newStepIndex }
    })
  }

  _cacheForm (e) {
    const formData = this.state.formData
    const name = e.target.name

    formData[name] = e.target.value
    this.setState({formData: formData})
  }

  _submit (e) {
    e.preventDefault()
    const phoneUtil = PhoneNumberUtil.getInstance()
    const data = Helpers.serializeForm(this.refs.form)

    // Format
    data['mobile'] = data.mobile ? `${data.statecode} ${data.mobile}` : ''
    if (!phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(`+${data.mobile}`, data.statecode))) {
      window.alert('手机号格式错误')
    }

    if (!data.planned_date_end) {
      delete data['planned_date_end']
    }

    ['photographer', 'participant', 'volunteer'].forEach((role) => {
      if (data.hasOwnProperty(role + '_schedule')) {
        const scheduleBin = [...Array(28).keys()].map(k => (data[role + '_schedule'].indexOf(k.toString()) === -1) ? '0' : '1').join('')
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
        window.alert(JSON.stringify(response))
      }
    })
  }

  _selectedRoleNames () {
    return Helpers.translateRoleNames(this.props.roles)
  }

  _renderRoles () {
    const roles = [{
      name: 'photographer',
      img: 'https://whale-token-im.b0.upaiyun.com/upload-img/photographer.png',
      title: '摄影师',
      description: '用图像记录其他推友'
    },
    {
      name: 'participant',
      img: 'https://whale-token-im.b0.upaiyun.com/upload-img/participant.png',
      title: '模特',
      description: '让摄影师拍摄你的现在与未来'
    },
    {
      name: 'volunteer',
      img: 'https://whale-token-im.b0.upaiyun.com/upload-img/volunteer.png',
      title: '志愿者',
      description: '作为活动的幕后人员'
    }]

    return roles.map((role, index) => {
      const isChecked = this.props.roles[role.name]
      const roleClass = isChecked ? 'role active' : 'role'

      return (
        <div className={roleClass} onClick={() => this._choiceRoles(role.name, !isChecked)} key={`${role.name}-${index}`}>
          <img src={role.img} />
          <p className="title">{role.title}</p>
          <p className="description">{role.description}</p>
        </div>
      )
    })
  }

  render () {
    const pageOneClass = this.props.stepIndex !== 0 ? 'page-one hide' : 'page-one'
    const pageTwoClass = this.props.stepIndex === 0 ? 'page-two hide' : 'page-two'

    return (
      <div className="sign-up">
        <h1 className="dg-enroll-title">Decadegraphy活动报名</h1>

        <div className={pageOneClass} hidden={this.props.stepIndex !== 0}>
          <h2 className="subtitle">你想作为 _<span style={{textDecoration: 'underline'}}>{this._selectedRoleNames().join('，')}</span>_ 参与这个活动<span className="notice">请选择角色</span></h2>
          <div className="form-item-group">
            {this._renderRoles()}
          </div>
          <div className="page-one-submit"><button className="dg-button" hidden={this._selectedRoleNames().length === 0} disabled={this._selectedRoleNames().length === 0} onClick={this._switchStep.bind(this, 1)}>下一步</button></div>
        </div>

        <form className={pageTwoClass} ref="form" onSubmit={this._submit.bind(this)}>
          <input name="roles" type="hidden" value={JSON.stringify(this.props.roles)} />
          <fieldset className="fill-role-info">
            <h2 className="subtitle">作为{this.props.roleNames[this.props.legacyRolesArray[this.props.stepIndex - 1] - 1]}的你，</h2>
            <p className="field-item">
              <label>
                <span className="field-name">*Twitter ID:</span>
                <input className="hide" type="text" name="twitter_id" value={this.props.twitterId || ''} required hidden />
                {
                  !this.props.twitterId
                    ? <a className="bind-twitter" href="/accounts/twitter/login/?process=login">绑定推特账号</a>
                    : <span className="twitter-name">@{this.props.twitterId}</span>
                }
              </label>
            </p>

            <div className="field-item">
              <label className="field-name" htmlFor="country">*所在地/首选拍摄地:</label>
              <CountryCityComponent />
            </div>

            <div ref="fieldsArray">
              { this.props.roles.photographer && <PhotographerFields /> }
              { this.props.roles.participant && <ParticipantFields /> }
              { this.props.roles.volunteer && <VolunteerFields /> }
            </div>

            <div className="field-item">
              <label className="field-name" htmlFor="email">*邮箱:</label>
              <input className="field" type="email" name="email" required />
            </div>

            <div className="field-item">
              <label className="field-name" htmlFor="password">*密码:</label>
              <input className="field" type="password" name="password" minLength={8} maxLength={20} required />
            </div>

            <div className="field-item">
              <label className="field-name" htmlFor="wechat_id">*微信号:</label>
              <input className="field" type="text" name="wechat_id" minLength={6} maxLength={20} required />
            </div>

            <div className="field-item">
              <label className="field-name" htmlFor="mobile">手机号:</label>
              <input defaultValue="86" name="statecode" className="field state-code" maxLength={3} />
              <input name="mobile" className="field field-mobile" maxLength={11} />
            </div>

            <div className="field-item">
              <label className="field-name" htmlFor="age">年龄:</label>
              <select name="age" className="field">
                <option>请选择</option>
                {this.props.ages.map((age, i) => <option key={i} value={age}>{age}</option>)}
              </select>
            </div>

            <div className="field-item">
              <label className="field-name" htmlFor="note">
                备注: <br/>
                余{1400 - this.state.inputWords}字
              </label>
              <textarea
                className="note"
                name="note"
                onKeyDown={e => { if ((e.keyCode !== 8) && (e.target.value.length > 1400)) { return e.preventDefault() } } }
                onKeyUp={e => this.setState({inputWords: e.target.value.length}) }
              />
            </div>
            <div className="dg-button-group">
              <a className="dg-button pre-step" onClick={this._switchStep.bind(this, -1)}>上一步</a>
              <a className="dg-button next-step" onClick={this._switchStep.bind(this, 1)} hidden={this.props.stepIndex === this.props.legacyRolesArray.length}>下一步</a>
              <button className="dg-button submit" hidden={this.props.stepIndex !== this.props.legacyRolesArray.length}>提交</button>
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

function mapStateToProps (state, props) {
  const { roles, stepIndex, twitterId } = state.campaigns
  const legacyRolesArray = []

  if (roles.photographer) {
    legacyRolesArray.push(1)
  }
  if (roles.participant) {
    legacyRolesArray.push(2)
  }
  if (roles.volunteer) {
    legacyRolesArray.push(3)
  }
  return {
    roles,
    legacyRolesArray,
    stepIndex,
    twitterId
  }
}

export default connect(mapStateToProps)(SignUp)
