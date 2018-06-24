import React from 'react'
import {Image, Transformation} from 'cloudinary-react'
import Helpers from '../../helpers.js'

import publicIdList from '../../works.json'

const imageSizes = [
  [[0.392, 0.294], [0.188, 0.121], [0.188, 0.121], [0.392, 0.1566]],
  [[0.282, 0.250], [0.204, 0.250], [0.282, 0.250]],
  [[0.172, 0.216], [0.204, 0.216], [0.392, 0.216]]
].map(row => {
  return row.map(s => [Math.round(window.screen.width * s[0]), Math.round(window.screen.width * s[1])])
})

class Home extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="home">
        <div className="slides">
          <ul>
            <li>你有故事，我们有镜头<br/>光和影，酸和甜，色块和黑白，被快门酿成酒。<br/>十年后，我们一起，喝个痛快。</li>
          </ul>
          <div className="slides-control">
            {[0, 1, 2].map(i => { return <a key={i} href="#">●</a> })}
          </div>
        </div>
        <div className="works">
          <div className="row-1">
            {publicIdList.splice(0, 4).map((id, i) => {
              return <Image cloudName="dgcdn" key={id} publicId={id} width={imageSizes[0][i][0]} height={imageSizes[0][i][1]} crop="fill" className={`work p-${i}`} />
            })}
          </div>
          <div className="row-2">
            {publicIdList.splice(0, 3).map((id, i) => {
              return <Image cloudName="dgcdn" key={id} publicId={id} width={imageSizes[1][i][0]} height={imageSizes[1][i][1]} crop="fill" />
            })}
          </div>
          <div className="row-3">
            {publicIdList.map((id, i) => {
              i = i % 3
              return <Image cloudName="dgcdn" key={id} publicId={id} width={imageSizes[2][i][0]} height={imageSizes[2][i][1]} crop="fill" />
            })}
          </div>
        </div>
      </div>
    )
  }
}
export default Home
