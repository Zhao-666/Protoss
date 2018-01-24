// pages/my/my.js
import { My } from 'my-model.js'
import { Address } from '../../utils/address.js'
import { Order } from '../order/order-model.js'

var my = new My()
var address = new Address()
var order = new Order()

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
    this._loadData()
  },

  _loadData: function () {
    my.getUserInfo((data) => {
      this.setData({
        userInfo: data
      })
    })
  }


})