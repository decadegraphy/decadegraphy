import React from 'react'
import ScheduleComponent from './ScheduleComponent'

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
        <div className="dg-cf field-item"><span className="field-name special">*可支配时间:</span><ScheduleComponent name="volunteer" /></div>
        <p className="field-item">
          <label><span className="field-name">*专业特长:</span></label>
          <select className="hobby-selection" name="skill">
            <option>请选择</option>
            {this.state.options.map((o, i) => <option key={i} value={i + 1}>{o}</option>)}
          </select>
        </p>
        <p className="field-item">
          <label><span className="field-name">*兴趣方向:</span></label>
          <select className="hobby-selection" name="will">
            <option value="">请选择</option>
            {this.state.options.map((o, i) => <option key={i} value={i + 1}>{o}</option>)}
          </select>
        </p>
      </div>
    )
  }
}

export default VolunteerFields
