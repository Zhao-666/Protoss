import { Base } from './base.js'
import { Config } from './config.js'

class Address extends Base {
  constructor() {
    super()
  }

  setAddressInfo(res) {
    var province = res.provinceName || res.province
    var city = res.cityName || res.city
    var country = res.countyName || res.county
    var detail = res.detailInfo || res.detail

    var totalDetail = city + country + detail

    if (!this.isCenterCity(province)) {
      totalDetail = province + totalDetail
    }
    return totalDetail
  }

  //是否直辖市
  isCenterCity(name) {
    var centerCitys = ['北京市', '重庆市', '上海市', '重庆市']
    var flag = centerCitys.indexOf(name) >= 0
    return flag
  }

  submitAddress(data, callback) {
    data = this._setUpAddress(data)
    var param = {
      url: 'address',
      type: 'post',
      data: data,
      sCallback: function (res) {
        callback && callback(true, res)
      },
      eCallback: function (res) {
        callback && callback(false, res)
      }
    }
    this.request(param)
  }

  _setUpAddress(res) {
    var formData = {
      name: res.userName,
      province: res.provinceName,
      city: res.cityName,
      county: res.countyName,
      mobile: res.telNumber,
      detail: res.detailInfo
    }
    return formData
  }
}

export { Address }