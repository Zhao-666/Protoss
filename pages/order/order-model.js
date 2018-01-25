import { Base } from '../../utils/base.js'

class Order extends Base {
  constructor() {
    super()
    this._storageKeyName = 'newOrder'
  }

  doOrder(param, callback) {
    var that = this
    var allParams = {
      url: 'order',
      type: 'post',
      data: { products: param },
      sCallback: function (data) {
        that.execSetStorageSync(true)
        callback && callback(data)
      },
      eCallback: function (data) {
      }
    }
    this.request(allParams)
  }

  execPay(orderNumber, callback) {
    var allParams = {
      url: 'pay/pre_order',
      type: 'post',
      data: { id: orderNumber },
      sCallback: function (data) {
        var timeStamp = data.timeStamp
        if (timeStamp) {
          wx.requestPayment({
            timeStamp: timeStamp.toString(),
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function () {
              callback && callback(2)
            },
            fail: function () {
              callback && callback(1)
            }
          })
        } else {
          callback && callback(0)
        }
      }
    }
    this.request(allParams)
  }

  getOrderInfoById(id, callback) {
    var param = {
      url: 'order/' + id + '?XDEBUG_SESSION_START=10534',
      sCallback: function (data) {
        callback && callback(data)
      },
      eCallback: function () {

      }
    }
    this.request(param)
  }

  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data)
  }

  getOrders(pageIndex, callback) {
    var param = {
      url: 'order/by_user',
      data: { page: pageIndex },
      type: 'get',
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(param)
  }

  //是否存在新的订单
  hasNewOrder() {
    var flag = wx.getStorageSync(this._storageKeyName)
    return flag == true
  }
}

export { Order }