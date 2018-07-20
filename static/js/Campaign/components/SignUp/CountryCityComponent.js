import React from 'react'
import Helpers from '../../../helpers.js'

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
    Helpers.getJSON('https://res.cloudinary.com/dgcdn/raw/upload/countries.json', (countries) => this.setState({countries}))
  }
  _selectPlace (e) {
    let code = e.target.value,
      name = e.target.name,
      regions = [],
      cnData

    if (name.indexOf('country') !== -1) {
      this.setState({regions: []})
      this.setState({cities: []})
      if (code === 'cn') {
        Helpers.getJSON('https://res.cloudinary.com/dgcdn/raw/upload/cn.regions.json', (response) => {
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
        Helpers.getJSON('https://res.cloudinary.com/dgcdn/raw/upload/regions.json', (response) => {
          regions = response.filter(r => r.country === code).map(r => { return {code: r.region.toLowerCase().replace(/ /g, '-'), name: r.region} })
          this.setState({regions})
        })
      }
    }

    if (name.indexOf('region') !== -1) {
      this.setState({cities: []})
      if (this.refs.country.value === 'cn') {
        this.setState({cities: Object.values(this.state.regions.filter(r => r.code === code)[0].cities)})
      } else {
        //
      }
    }
  }

  render () {
    let selectPrefix = this.props.name ? (this.props.name + '_') : '',
      arraySuffix = (this.props.name === 'participant') ? '[]' : '',
      citySelect = <select className="field" name={`${selectPrefix}city${arraySuffix}`}>
        <option value="">市/县</option>
        {this.state.cities.map((c, i) => <option key={i} value={c.en}>{c.en}</option>)}
      </select>

    return (
      <div className="places">
        <select className="field" ref="country" name={`${selectPrefix}country${arraySuffix}`} onChange={this._selectPlace.bind(this)}>
          <option value="">国家/地区</option>
          {this.state.countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
        <select className="field" name={`${selectPrefix}region${arraySuffix}`} onChange={this._selectPlace.bind(this)}>
          <option value="">省/州</option>
          {this.state.regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        {(this.state.cities.length === 0) ? <input className="field" name={`${selectPrefix}city${arraySuffix}`} placeholder="城市" /> : citySelect }
      </div>
    )
  }
}

export default CountryCityComponent
