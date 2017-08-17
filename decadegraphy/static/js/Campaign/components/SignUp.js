import React from 'react'
import moment from 'moment'
import Helpers from '../../helpers.js'

moment.locale('zh-CN')

let COUNTRIES = []
Helpers.getJSON('https://res.cloudinary.com/dgcdn/raw/upload/v1502605220/countries.json', (response) => { COUNTRIES = response })
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
        Helpers.getJSON('https://res.cloudinary.com/dgcdn/raw/upload/v1502605838/cn.regions.json', (response) => {
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
        Helpers.getJSON('https://res.cloudinary.com/dgcdn/raw/upload/v1502605434/regions.json', (response) => {
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
    let citySelect = <select name="city">
      <option>市/县</option>
      {this.state.cities.map((c, i) => <option key={i}>{c.en}</option>)}
    </select>

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
        {(this.state.cities.length === 0) ? <input name="city" placeholder="城市" /> : citySelect }
      </div>
    )
  }
}

class ScheduleComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dayOfWeekArray: [...Array(7).keys()].map(i => moment().day(i + 1).format('dddd'))
    }
  }

  _select (e) {
    let value = parseInt(e.target.value),
      isChecked = e.target.checked,
      inputs = this.refs.tbody.getElementsByTagName('input')

    for (let i = 0; i < inputs.length; i++) {
      if (value <= 6) { // 全天
        if (i % 7 - value === 0) {
          inputs[i].checked = isChecked
        }
      } else {
        if (!isChecked) {
          inputs[value % 7].checked = isChecked
        }
      }
    }
  }

  render () {
    return (
      <div className="timepicker">
        <span className="tip">如果不确定，可以选择全天</span>
        <table className="timepicker-table">
          <thead>
            <tr>
              <th></th>
              {this.state.dayOfWeekArray.map((d, i) => <th key={i}>{d}</th>)}
            </tr>
          </thead>
          <tbody ref="tbody">
            {['全天', moment('8', 'H').format('A'), moment('16', 'H').format('A'), moment('23', 'H').format('A')].map((a, i) => {
              return (
                <tr key={i}>
                  <td>{a}</td>
                  {[...Array(7).keys()].map(_i => <td key={_i}><input onClick={this._select.bind(this)} value={7 * i + _i} type="checkbox" /></td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

class ParticipantFields extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      extraOptionalPlaceComponent: [],
      inputWords: 0
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
        <div className="dg-cf field-item">
          <label>
            <span className="field-name special">备选拍摄地:</span>
            <div className="optional-places">
              <div ref="optionalPlaces"></div>
              <CountryCityComponent />
              {this.state.extraOptionalPlaceComponent.map(c => (c))}
              <div className="optional-places-action">
                <span style={{display: (this.state.extraOptionalPlaceComponent.length > 1) ? 'none' : ''}} className="icon" onClick={this._handlePlaces.bind(this, 'insert')}>+</span>
                <span style={{display: (this.state.extraOptionalPlaceComponent.length === 0) ? 'none' : ''}} className="icon" onClick={this._handlePlaces.bind(this, 'remove')}>-</span>
              </div>
            </div>
          </label>
        </div>

        <p className="field-item"><label><span className="field-name">*预计拍摄时间:</span><input type="date" name="planned_date" className="planned-date" placeholder="起始日期" /><span className="planned-date-delimiter">至</span><input type="date" name="planned_date" placeholder="不限制则留空" className="planned-date" /></label></p>

        <div className="field-item"><label><span className="field-name">拍摄故事:</span><textarea
          onKeyDown={e => { if ((e.keyCode !== 8) && (e.target.value.length > 1400)) { return e.preventDefault() } } }
          onKeyUp={e => this.setState({inputWords: e.target.value.length}) }
          placeholder="你有撰写10条推的空间告诉我们你的故事"></textarea></label><p className="word-count">余{1400 - this.state.inputWords}字</p></div>
      </div>
    )
  }
}

class PhotographerFields extends React.Component {
  render () {
    return (
      <div>
        <p className="dg-cf field-item"><label><span className="field-name special">备选拍摄地:</span></label>
          <CountryCityComponent /></p>
        <div className="dg-cf field-item"><span className="field-name special">*可拍摄时段:</span><ScheduleComponent /></div>
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
        <div className="dg-cf field-item"><span className="field-name special">*可支配时间:</span><ScheduleComponent /></div>
        <p className="field-item">
          <label><span className="field-name">*专业特长:</span></label>
          <select className="hobby-selection">
            <option>请选择</option>
            {this.state.options.map((o, i) => <option key={i}>{o}</option>)}
          </select>
        </p>
        <p className="field-item">
          <label><span className="field-name">*兴趣方向:</span></label>
          <select className="hobby-selection">
            <option>请选择</option>
            {this.state.options.map((o, i) => <option key={i}>{o}</option>)}
          </select>
        </p>
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
      cities: [],
      inputWords: 0
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
      <div className="sign-up">
        <form ref="form">
          <input name="roles" type="hidden" value={this.state.roles.join(',')} />
          <h1 className="dg-enroll-title">Decadegraphy活动报名</h1>
          <div className="page-one" hidden={this.state.stepIndex !== 0}>
            <h2 className="subtitle"><b>你</b>想作为 _<span style={{textDecoration: 'underline'}}>{this.state.roles.map(role => this.state.roleNames[role - 1]).join(', ')}</span>_ 参与这个活动<span className="notice">请选择角色</span></h2>
            <div className="form-item-group">
              <p><label><input type="checkbox" onClick={this._choiceRoles.bind(this, 1)} />摄影师，用图像记录其他推友</label></p>
              <p><label><input type="checkbox" onClick={this._choiceRoles.bind(this, 2)} />模特，让摄影师拍摄你的现在与未来</label></p>
              <p><label><input type="checkbox" onClick={this._choiceRoles.bind(this, 3)} />志愿者，作为活动的幕后人员</label></p>
            </div>
            <a className="dg-button" hidden={this.state.roles.length === 0} onClick={e => this.setState({stepIndex: 1})}>下一步</a>
          </div>

          <fieldset className="fill-role-info" hidden={this.state.stepIndex === 0}>
            <h2 className="subtitle">作为{this.state.roleNames[this.state.roles[this.state.stepIndex - 1] - 1]}的你，</h2>
            <p className="field-item"><label><span className="field-name">*Twitter ID:</span><input className="field" type="text" name="twitter_id" hidden /><button className="bind-twitter">绑定推特账号</button><span className="twitter-name">@jessieste</span></label></p>
            <p className="field-item"><label><span className="field-name">*邮箱:</span><input className="field" type="email" name="email" required /></label></p>
            <p className="field-item"><label><span className="field-name">*密码:</span><input className="field" type="password" name="password" required /></label></p>
            <p className="field-item"><label><span className="field-name">*微信号:</span><input className="field" type="text" name="wechat_id" required /></label></p>
            <p className="field-item"><label><span className="field-name">手机号:</span><span className="tel-content">+<input type="number" defaultValue="86" name="statecode" className="state-code" min="1" /><input className="field" type="number" name="mobile" className="field field-mobile" min="1" /></span></label></p>
            <p className="field-item">
              <label>
                <span className="field-name">年龄:</span>
                <select name="age" className="select-age">
                  <option>请选择</option>
                  {this.state.ages.map((age, i) => <option key={i} value={age}>{age}</option>)}
                </select>
              </label>
            </p>
            <p className="dg-cf field-item"><label><span className="field-name special">*所在地:</span>
              <CountryCityComponent /></label></p>

            {[<PhotographerFields />, <ParticipantFields />, <VolunteerFields />][this.state.roles[this.state.stepIndex - 1] - 1]}

            <div className="field-item"><label><span className="field-name">备注:</span>
              <textarea className="note" name="note"
                onKeyDown={e => { if ((e.keyCode !== 8) && (e.target.value.length > 1400)) { return e.preventDefault() } } }
                onKeyUp={e => this.setState({inputWords: e.target.value.length}) }></textarea></label><p className="word-count">余{1400 - this.state.inputWords}字</p></div>
            <div className="dg-button-group">
              <a className="dg-button pre-step" onClick={e => this.setState({stepIndex: this.state.stepIndex - 1})}>上一步</a>
              <a className="dg-button next-step" onClick={e => this.setState({stepIndex: this.state.stepIndex + 1})} hidden={this.state.stepIndex === this.state.roles.length}>下一步</a>
              <button className="dg-button submit" onClick={this._submit.bind(this)} hidden={this.state.stepIndex !== this.state.roles.length}>提交</button>
            </div>
          </fieldset>
        </form>
        <div className="enroll-success">
          <img src="" alt="" className="success-icon" />
          <div className="content">
            <p>报名成功</p>
            <p>您的身份是：摄影师、志愿者</p>
            <p>扫描下方二维码加入城市拍摄微信群，</p>
            <p>开始你的Decadegraphy旅程</p>
            <ul className="qrcode">
              <li><img src="" alt="" /><span>上海交流群</span></li>
              <li><img src="" alt="" /><span>厦门交流群</span></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default SignUp
