import { Config } from 'config.js'

class Base {

  constructor() {
    this.baseRequestUrl = Config.restUrl
  }

  request(params) {
    var url = this.baseRequestUrl + params.url
    if (!params.type) {
      params.type = 'GET'
    }
    wx.request({
      url: url,
      data: params.data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageInfoSync('token')
      },
      method: params.type,
      success: function (res) {
        params.sCallback && params.sCallback(res.data)
      },
      fail: function (res) {

      },
    })
  }
}

export { Base }