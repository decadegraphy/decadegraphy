import React from 'react'
import ReactDOM from 'react-dom'
import {Image, Transformation} from 'cloudinary-react'
import InfiniteScroll from 'infinite-scroll'
import Helpers from '../../helpers.js'

const imageSizes = [
  [[0.392, 0.294], [0.188, 0.121], [0.188, 0.121], [0.392, 0.1566]],
  [[0.282, 0.250], [0.204, 0.250], [0.282, 0.250]],
  [[0.172, 0.216], [0.204, 0.216], [0.392, 0.216]]
].map(row => {
  const width = window.screen.width
  if (width < 767) {
    return row.map(s => [width, 'auto'])
  }
  else {
    return row.map(s => [Math.round(width * s[0]), Math.round(width * s[1])])
  }
})

class WorkModalContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      photos: this.props.work.photos
    }
  }

  _next () {
    this.state.photos.unshift(this.state.photos.splice(-1)[0])
    this.setState({photos: this.state.photos})
  }

  render () {
    const work = this.props.work
    return (
      <div>
        <div className="work-modal-container">
          <div className="album">
            {this.state.photos.map(photo => <Image key={photo.cloud_id} cloudName="dgcdn" publicId={photo.cloud_id} onClick={() => this._next() }>{(window.screen.width < 767) ? <Transformation width={window.innerWidth} crop="fill" /> : <Transformation height={window.innerHeight} crop="fill" />}</Image>)}
          </div>
          <div className="intro-container">
            <div className="intro">
              <div className="user"><a href={`https://twitter.com/${work.participant}`}><img src={`/static/avatar/${work.participant}.jpg`} /></a><div className="name">拍摄模特<br/>@{work.participant}</div></div>
              <div className="user"><a href={`https://twitter.com/${work.photographer}`}><img src={`/static/avatar/${work.photographer}.jpg`} /></a><div className="name">摄影师<br/>@{work.photographer}</div></div>
              <div className="meta"><i className="icon-location" />{work.location}<br/><i className="icon-date" />{work.publication_date}</div>
              <p>{work.story}</p>
            </div>
            <div className="actions">
              <a><i className="icon-like" />{work.likes}</a>
              <a><i className="icon-comment" />{work.comments}</a>
              <a><i className="icon-share" />{work.shares}</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isModalOpen: false,
      works: []
    }
  }

  componentDidMount () {
    Helpers.getJSON('/api/works/', response => {
      const works = response.results
      this.setState({works})
    })

    const infiniteScroll = new InfiniteScroll('.works', {
      path: '/api/works/?page={{#}}',
      checkLastPage: true,
      responseType: 'document',
      scrollThreshold: 400
    })
  }

  _toggleModal (publicId) {
    const DOM = this.refs.workContent
    const work = this.state.works.filter(w => w.cover === publicId)[0]
    !this.state.isModalOpen ? ReactDOM.render(<WorkModalContent work={work} />, DOM) : ReactDOM.unmountComponentAtNode(DOM)
    this.setState({isModalOpen: !this.state.isModalOpen})
  }

  render () {
    const publicIdList = this.state.works.map(r => r.cover).slice(0)
    return (
      <div className="home">
        <div className="slides">
          <ul>
            <li>你有故事，我们有镜头<br/>光和影，酸和甜，色块和黑白，被快门酿成酒。<br/>十年后，我们一起，喝个痛快。</li>
          </ul>
          <div className="slides-control">
            {[0, 1, 2].map(i => { return <a key={i} href="javascript:void(0)">●</a> })}
          </div>
        </div>
        <div className="works">
          {[4, 3, 3].map(i => publicIdList.splice(0, i)).map((idArray, rowIndex) => {
            return (
              <div key={rowIndex} className={`row-${rowIndex + 1}`}>
                {idArray.map((id, i) => {
                  return <Image cloudName="dgcdn" publicId={id} key={id} className="work" onClick={() => this._toggleModal(id)} >{(imageSizes[rowIndex][i][1] === 'auto') ? <Transformation width={imageSizes[rowIndex][i][0]} crop="fill"/> : <Transformation width={imageSizes[rowIndex][i][0]} height={imageSizes[rowIndex][i][1]} crop="fill"/>}</Image>
                })}
              </div>
            )
          })}
        </div>
        <div className="modal" style={{display: this.state.isModalOpen ? 'block' : 'none'}}>
          <div className="top-gradient" />
          <div className="modal-content">
            <span className="close" onClick={() => this._toggleModal() }>&times;</span>
            <div ref="workContent" />
          </div>
        </div>
      </div>
    )
  }
}
export default Home
