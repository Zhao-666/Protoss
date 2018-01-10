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
      this.setData({
        bannerArr: res
      })
    })
    home.getThemeData((data)=>{
      this.setData({
        themeArr:data
      })
    })
    home.getProductsData((data) => {
      this.setData({
        productsArr: data
      })
    })
  }
})