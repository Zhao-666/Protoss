import { Config } from './config.js'
var config = new Config()

class Token {
  constructor() {
    this.verifyUrl = Config.restUrl + 'token/verify'
    this.tokenUrl = Config.restUrl + 'token/user'
  }

  verify() {
    var token = wx.getStorageSync('token')
    if (!token) {
      this.getTokenFromServer()
    } else {
      this._verifyFromServer(token)
    }
  }
  //从服务器获取Token
  getTokenFromServer(callback) {
    var that = this
    wx.login({
      success: function (res) {
        wx.request({
          url: that.tokenUrl,
          method: 'post',
          data: {
            code: res.code
          },
          success: function (res) {
            wx.setStorageSync('token', res.data.token)
            callback && callback(res.data.token)
          }
        })
      }
    })
  }
  //携带令牌去服务器校验令牌
  _verifyFromServer(token) {
    var that = this
    wx.request({
      url: that.verifyUrl,
      method: 'get',
      data: {
        token: token
      },
      success: function (res) {
        var valid = res.data.isValid
        if (!valid) {
          that.getTokenFromServer()
        }
      }
    })
  }
}

export { Token }