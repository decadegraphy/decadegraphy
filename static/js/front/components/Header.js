import { Link } from 'react-router-dom'
import React from 'react'

export default class Header extends React.Component {
  _toggleNav () {
    const isNone = (document.getElementsByClassName('global-nav')[0].clientHeight === 0)
    this.refs.globalNav.style.display = isNone ? 'block' : 'none'
  }

  render () {
    return (
      <header className="global-header">
        <div className="container">
          <h1 className="header-title">
            <a href="/">
              <img src="/static/img/logo_header.jpg" alt="旬影" className="header-logo" />
            </a>
          </h1>
          <ul className="global-nav" ref="globalNav">
            <li><a href="https://twitter.com/Decadegraphy/status/894124009721257984">关于</a></li>
            <li><a href="javascript:void(0)" onClick={() => alert('Coming soon')}>博客</a></li>
            <li><a href="https://twitter.com/Decadegraphy">支持</a></li>
            <li><a href="https://decadegraphy.slack.com/">加入</a></li>
            <li className="locale">
              <a href="javascript:void(0)">CN</a>
              <span className="dg-split-line">|</span>
              <a href="javascript:void(0)" style={{ color: '#B8B8B8' }}>EN</a>
            </li>
          </ul>
          <button className="nav-toggle-button" onClick={() => this._toggleNav()}>☰</button>
        </div>
      </header>
    )
  }
}
