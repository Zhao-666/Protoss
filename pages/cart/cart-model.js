import { Base } from '../../utils/base.js'

class Cart extends Base {
  constructor() {
    super()
    this._storageKeyName = 'cart'
  }

  add(item, counts) {
    var cartData = this.getCartDataFromLocal()
    var isHasInfo = this._isHasThatOne(item.id, cartData)
    if (isHasInfo.index == -1) {
      item.counts = counts
      item.selectStatus = true
      cartData.push(item)
    } else {
      cartData[isHasInfo.index].counts += counts
    }
    wx.setStorageSync(this._storageKeyName, cartData)
  }

  getCartDataFromLocal() {
    var res = wx.getStorageSync(this._storageKeyName)
    if (!res) {
      res = []
    }
    return res
  }

  //flag true -考虑商品被选中状态    false -不考虑
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal()
    var counts = 0;
    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts += data[i].counts
        }
      } else {
        counts += data[i].counts
      }
    }
    return counts
  }

  _isHasThatOne(id, arr) {
    var result = { index: -1 }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == id) {
        result = {
          index: i,
          data: arr[i]
        }
        break
      }
    }
    return result
  }
}

export { Cart }