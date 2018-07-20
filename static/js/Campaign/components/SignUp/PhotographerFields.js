import React from 'react'
import CountryCityComponent from './CountryCityComponent'
import ScheduleComponent from './ScheduleComponent'

class PhotographerFields extends React.Component {
  render () {
    return (
      <div>
        <div className="dg-cf field-item">
          <label className="field-name special">备选拍摄地:</label>
          <CountryCityComponent name="photographer" />
        </div>
        <div className="dg-cf field-item">
          <span className="field-name special">*可拍摄时段:</span>
          <ScheduleComponent name="photographer" />
        </div>
      </div>
    )
  }
}

export default PhotographerFields
