import React from 'react'
import moment from 'moment'

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
                  {[...Array(7).keys()].map(_i => <td key={_i}><input name={this.props.name + '_schedule[]'} onClick={this._select.bind(this)} value={7 * i + _i} type="checkbox" /></td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default ScheduleComponent
