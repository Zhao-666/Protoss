// pages/home/home.js
import { Home } from 'home-model.js'
var home = new Home()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function () {
    console.log('qwe')
    this._loadData()
  },
  _loadData: function () {
    var id = 1
    home.getBannerData(id, (res) => {
      console.log(res)
      this.setData({
        bannerArr: res
      })
    })
  }
})