import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
  combineReducers(reducers),
  {
    from: '北京', // 出发地
    to: '上海', // 目的地
    isCitySelectorVisible: false, // 城市选择浮层
    currentSelectingLeftCity: false, // 当前选择的城市
    cityData: null, // 城市列表
    isLoadingCityData: false, // 是否正在加载城市数据
    isDateSelectorVisible: false, // 日期选择浮层
    // departDate: new Date(),
    highSpeed: false // 是否只看高铁动车
  },
  applyMiddleware(thunk)
)