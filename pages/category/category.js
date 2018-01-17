// pages/category/category.js
import { Category } from './category-model.js'
var category = new Category()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5'],
    selectedCategory: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData(options)
  },

  _loadData: function (options) {
    category.getCategoryType((categoryData) => {
      this.setData({
        categoryTypeArr: categoryData
      })
      category.getProductsByCategory(categoryData[0].id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        }
        this.setData({
          categoryInfo0: dataObj
        })
      })
    })
  },

  changeCategory: function (event) {
    var index = category.getDataSet(event, 'index')
    var id = category.getDataSet(event, 'id')
    this.setData({
      selectedCategory: index
    })
    //如果数据是第一次请求
    if (!this.isLoadedData(index)) {
      category.getProductsByCategory(id, (data) => {
        this.setData(this.getDataObjForBind(index, data));
      });
    }
  },

  isLoadedData: function (index) {
    if (this.data['categoryInfo' + index]) {
      return true
    }
    return false
  },

  getDataObjForBind: function (index, data) {
    var obj = {},
      arr = [0, 1, 2, 3, 4, 5],
      baseData = this.data.categoryTypeArr[index];
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = {
          products: data,
          topImgUrl: baseData.img.url,
          title: baseData.name
        };

        return obj;
      }
    }
  },

  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id')
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }

})