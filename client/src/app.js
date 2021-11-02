import React, { Component } from 'react'
import Taro from '@tarojs/taro'

import './theme_variables.scss'
import 'taro-ui/dist/style/index.scss'
import './app.scss'

class App extends Component {

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        // env: 'production-7gcqn3ctf155e0b2',
        env: 'jiaotangguazi-3g8pm0e9fbbac512',
        traceUser: true,
      })
    }
  }

  globalData = {
    isAdmin: false,
    adminOpenIdList: ['oQ48T0c8E8r8Z42HS1Mf8MAnNKNE', 'oQ48T0aRqoZRXFy9RgJk7TsW_Yow', 'oQ48T0fWMZuDzIS7nnbnubpWUzU0']
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
