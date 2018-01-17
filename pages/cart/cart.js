// pages/cart/cart.js
import { Cart } from './cart-model.js'

var cart = new Cart()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var cartData = cart.getCartDataFromLocal()
    var countsInfo = cart.getCartTotalCounts(true)

    this.setData({
      selectedCounts: countsInfo,
      cartData
    })
  },


  _calcTotalAccountAndCounts: function (data) {
    var len = data.length
    var account = 0 //总价格
    var selectedCounts = 0 //购买商品的总个数
    var selectedTypeCounts = 0 //购买商品的种类个数


  }

})