import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'

import { h0 } from '../common/fp'
import { ORDER_DEPART } from './constant'

import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
  combineReducers(reducers),
  {
    from: null,
    to: null,
    departDate: h0(), // 出发时间
    highSpeed: false,
    trainList: [], // 列车列表
    orderType: ORDER_DEPART, // 排序
    onlyTickets: false, // 只看有票
    ticketTypes: [], // 坐席类型
    checkedTicketTypes: {}, // 选中的坐骑类型
    trainTypes: [], // 车次类型
    checkedTrainTypes: {}, // 选中的车次类型
    departStations: [], // 出发车站
    checkedDepartStations: {}, // 选中的出发车站
    arriveStations: [], // 到达车站
    checkedArriveStations: {}, // 选中的到达车站
    departTimeStart: 0, // 出发时间开始
    departTimeEnd: 24, // 出发时间结束
    arriveTimeStart: 0, // 到达时间开始
    arriveTimeEnd: 24, // 到达时间结束
    isFiltersVisible: false, // 显示筛选浮层
    searchParsed: false // 是否解析完成url
  },
  applyMiddleware(thunk)
)