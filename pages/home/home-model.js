import { Base } from '../../utils/base.js'

class Home extends Base {
  constructor() {
    super()
  }
  getBannerData(id, callBack) {
    var params = {
      url: 'banner/' + id,
      sCallback: function (res) {
        callBack && callBack(res.items)
      }
    }
    this.request(params)
  }
}

export { Home }