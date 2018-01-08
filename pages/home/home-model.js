class Home {
  constructor() {

  }
  getBannerData(id,callBack) {
    var result
    wx.request({
      url: 'http://zerg.com/api/v1/banner/' + id,
      method: 'GET',
      success: function (res) {
        callBack(res)
      },
      fail: function (res) {

      }
    })
  }
}

export { Home }