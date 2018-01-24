import { Cart } from '../cart/cart-model.js'
import { Address } from '../../utils/address.js'
import { Order } from 'order-model.js'


var cart = new Cart()
var address = new Address()
var order = new Order()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productsArr = cart.getCartDataFromLocal(true)
    var account = options.account

    this.setData({
      productsArr,
      account,
      orderStatus: 0
    })

    address.getAddressInfo((res) => {
      this._bindAddressInfo(res)
    })
  },

  onShow: function () {
    if (this.data.id) {
      var that = this
      var id = this.data.id
      order.getOrderInfoById(id, (data) => {
        that.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          }
        })
      })

      var addressInfo = data.snap_address
      addressInfo.totalDetail = address.setAddressInfo(addresInfo)
      that._bindAddressInfo(addressInfo)
    }
  },

  editAddress: function (event) {
    var that = this
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }
        that._bindAddressInfo(addressInfo)

        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败！')
          }
        })
      }
    })
  },

  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '../my/my',
          })
        }
      }
    })
  },

  pay: function () {
    if (!this.data.addressInfo) {
      this.showTips('下单提示', '请填写您的收货地址')
      return
    }
    if (this.data.orderStatus == 0) {
      this._firstTimePay()
    } else {
      this._oneMoresTimePay()
    }
  },

  _firstTimePay: function () {
    var orderInfo = []
    var productInfo = this.data.productsArr
    var order = new Order()
    for (let i = 0; i < productInfo.length; i++) {
      orderInfo.push({
        product_id: productInfo[i].id,
        count: productInfo[i].counts
      })
    }

    var that = this
    order.doOrder(orderInfo, (data) => {
      if (data.pass) {
        var id = data.order_id
        that.data.id = id
        that.data.fromCartFlag = false

        that._execPay(id)
      } else {
        that._orderFail(data)
      }
    })
  },

  _execPay: function (id) {
    var that = this
    order.execPay(id, (statusCode) => {
      if (statusCode !== 0) {
        that.deleteProducts();
        var flag = statusCode == 2
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order',
        })
      }
    })
  },

  /*
       *下单失败
       * params:
       * data - {obj} 订单结果信息
       * */
  _orderFail: function (data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function (res) {

      }
    });
  },
  deleteProducts: function () {
    var ids = []
    var arr = this.data.productsArr
    for (let i = 0; i < arr; i++) {
      ids.push(arr[i].id)
    }
    cart.deleteProduct(ids)
  },

  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo
    })
  }

})