import { Config } from 'config.js'
import { Token } from 'token.js'

class Base {

  constructor() {
    this.baseRequestUrl = Config.restUrl
  }

  //当noRefetch为true时不重试获取Token
  request(params, noRefetch) {
    var url = this.baseRequestUrl + params.url + '?XDEBUG_SESSION_START=10534'
    var that = this

    if (!params.type) {
      params.type = 'GET'
    }
    wx.request({
      url: url,
      data: params.data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: params.type,
      success: function (res) {
        var code = res.statusCode.toString()
        var startChar = code.charAt(0)
        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data)
        } else {
          if (code == '401' && !noRefetch) {
            that._refetch(params)
          }
          if (noRefetch) {
            params.eCallback && params.eCallback(res.data)
          }
        }
      },
      fail: function (res) {
        params.eCallback && params.eCallback(res.data)
      },
    })
  }

  _refetch(params) {
    var token = new Token()
    token.getTokenFromServer((token) => {
      this.request(params, true)
    })
  }

  //获取元素上绑定的值
  getDataSet(event, key) {
    return event.currentTarget.dataset[key]
  }
}

export { Base }