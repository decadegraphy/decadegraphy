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
    return (
      <div>
        <div className="dg-cf field-item">
          <label>
            <span className="field-name special">备选拍摄地:</span>
            <div className="optional-places">
              <div ref="optionalPlaces"></div>
              <CountryCityComponent name="participant" />
              {this.state.extraOptionalPlaceComponent.map(c => (c))}
              <div className="optional-places-action">
                <span style={{display: (this.state.extraOptionalPlaceComponent.length > 1) ? 'none' : ''}} className="icon" onClick={this._handlePlaces.bind(this, 'insert')}>+</span>
                <span style={{display: (this.state.extraOptionalPlaceComponent.length === 0) ? 'none' : ''}} className="icon" onClick={this._handlePlaces.bind(this, 'remove')}>-</span>
              </div>
            </div>
          </label>
        </div>

        <p className="field-item"><label><span className="field-name">*预计拍摄时间:</span><input type="date" name="planned_date_start" className="planned-date" placeholder="起始日期" /><span className="planned-date-delimiter">至</span><input type="date" name="planned_date_end" placeholder="不限制则留空" className="planned-date" /></label></p>

        <div className="field-item"><label><span className="field-name">拍摄故事:</span><textarea name="story"
          onKeyDown={e => { if ((e.keyCode !== 8) && (e.target.value.length > 1400)) { return e.preventDefault() } } }
          onKeyUp={e => this.setState({inputWords: e.target.value.length}) }
          placeholder="你有撰写10条推的空间告诉我们你的故事"></textarea></label><p className="word-count">余{1400 - this.state.inputWords}字</p></div>
      </div>
    )
  }
}

export default ParticipantFields
