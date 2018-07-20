import React from 'react'
import CountryCityComponent from './CountryCityComponent'

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
      extraOptionalPlaceComponent.push(<CountryCityComponent name="participant" />)
    } else if (action === 'remove') {
      extraOptionalPlaceComponent.pop()
    }
    this.setState({extraOptionalPlaceComponent})
  }
  render () {
    const isAdd = this.state.extraOptionalPlaceComponent.length > 1
    const isMinus = this.state.extraOptionalPlaceComponent.length === 0
    return (
      <div>
        <div className="dg-cf field-item">
          <label className="field-name special" htmlFor="participant">备选拍摄地:</label>
          <div className="optional-places">
            <div ref="optionalPlaces"></div>
            <CountryCityComponent name="participant" />
            {this.state.extraOptionalPlaceComponent.map(c => (c))}
            <div className="optional-places-action">
              <span
                style={{display: isAdd ? 'none' : ''}}
                className="dg-icon"
                onClick={this._handlePlaces.bind(this, 'insert')}>
                +
              </span>
              <span
                style={{display: isMinus ? 'none' : ''}}
                className="dg-icon"
                onClick={this._handlePlaces.bind(this, 'remove')}>
                -
              </span>
            </div>
          </div>
        </div>

        <div className="field-item">
          <label className="field-name">*预计拍摄时间:</label>
          <input type="date" name="planned_date_start" className="planned-date" placeholder="起始日期" />
          <span className="planned-date-delimiter">至</span>
          <input type="date" name="planned_date_end" placeholder="不限制则留空" className="planned-date" />
        </div>

        <div className="field-item">
          <label className="field-name" htmlFor="story">拍摄故事: <br /> 余{1400 - this.state.inputWords}字</label>
          <textarea
            className="note"
            name="story"
            onKeyDown={e => { if ((e.keyCode !== 8) && (e.target.value.length > 1400)) { return e.preventDefault() } } }
            onKeyUp={e => this.setState({inputWords: e.target.value.length})}
            placeholder="你有撰写10条推的空间告诉我们你的故事"
          />
        </div>
      </div>
    )
  }
}

export default ParticipantFields
