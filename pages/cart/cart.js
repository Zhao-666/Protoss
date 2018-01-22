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
  onHide: function () {
    cart.execSetStorageSync(this.data.cartData)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var cartData = cart.getCartDataFromLocal()
    //var countsInfo = cart.getCartTotalCounts(true)
    var cal = this._calcTotalAccountAndCounts(cartData)

    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
      cartData
    })
  },

  _calcTotalAccountAndCounts: function (data) {
    var len = data.length
    var account = 0 //总价格
    var selectedCounts = 0 //购买商品的总个数
    var selectedTypeCounts = 0 //购买商品的种类个数

    let multiple = 100

    for (let i = 0; i < len; i++) {
      if (data[i].selectStatus) {
        account += data[i].counts * multiple * Number(data[i].price) * multiple
        selectedCounts += data[i].counts
        selectedTypeCounts++
      }
    }
    return {
      selectedCounts,
      selectedTypeCounts,
      account: account / (multiple * multiple)
    }
  },

  toggleSelect: function (event) {
    var id = cart.getDataSet(event, 'id')
    var status = cart.getDataSet(event, 'status')
    var index = this._getProductIndexById(id)
    var cartData = this.data.cartData
    cartData[index].selectStatus = !status
    this.setData({
      cartData
    })
    this._resetCartData()
  },
  toggleSelectAll: function (event) {
    var status = cart.getDataSet(event, 'status') == 'true'

    var cartData = this.data.cartData
    var len = cartData.length
    for (let i = 0; i < len; i++) {
      cartData[i].selectStatus = !status
    }
    this.setData({
      cartData
    })
    this._resetCartData()
  },

  _resetCartData: function () {
    var newData = this._calcTotalAccountAndCounts(this.data.cartData)

    this.setData({
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account
    })
  },

  _getProductIndexById: function (id) {
    var data = this.data.cartData
    var len = data.length
    for (let i = 0; i < len; i++) {
      if (data[i].id == id) {
        return i
      }
    }
  },

  changeCounts: function (event) {
    var type = cart.getDataSet(event, 'type')
    var id = cart.getDataSet(event, 'id')
    var index = this._getProductIndexById(id)
    var counts = 1
    if (type == 'cut') {
      counts = -1
      cart.cutCounts(id)
    } else {
      cart.addCounts(id)
    }

    var cartData = this.data.cartData
    cartData[index].counts += counts
    this.setData({
      cartData
    })
    this._resetCartData()
  },

  delete: function (event) {
    var id = cart.getDataSet(event, 'id')
    var index = this._getProductIndexById(id)

    var cartData = this.data.cartData
    cartData.splice(index, 1)
    this.setData({
      cartData
    })

    this._resetCartData()
    cart.deleteProduct(id)
  },

  submitOrder: function (event) {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    })
  }

})