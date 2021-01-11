import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import URI from 'urijs'
import dayjs from 'dayjs'
import { h0 } from '../common/fp'

import Header from '../common/Header'
import Nav from '../common/Nav'
import List from './List'
import Bottom from './Bottom'
import useNav from '../common/useNav'

import {
  setFrom,
  setTo,
  setDepartDate,
  setHighSpeed,
  setSearchParsed,

  setTrainList,
  setTicketTypes,
  setTrainTypes,
  setDepartStations,
  setArriveStations,
  nextDate,
  prevDate
} from './actions'

import './App.css'

function App(props) {

  const {
    trainList,
    from,
    to,
    dispatch,
    departDate,
    highSpeed,
    searchParsed,
    orderType,
    onlyTickets,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
  } = props

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search)
    const {
      from,
      to,
      date,
      highSpeed
    } = queries

    dispatch(setFrom(from))
    dispatch(setTo(to))
    dispatch(setDepartDate(h0(dayjs(date).valueOf())))
    dispatch(setHighSpeed(highSpeed === 'true'))

    dispatch(setSearchParsed(true))

  }, [dispatch])

  useEffect(() => {
    if (!searchParsed) {
      return;
    }

    const url = new URI('/rest/query')
      .setSearch('from', from)
      .setSearch('to', to)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('highSpeed', highSpeed)
      .setSearch('orderType', orderType)
      .setSearch('onlyTickets', onlyTickets)
      .setSearch('checkedTicketTypes', Object.keys(checkedTicketTypes).join())
      .setSearch('checkedTrainTypes', Object.keys(checkedTrainTypes).join())
      .setSearch('checkedDepartStations', Object.keys(checkedDepartStations).join())
      .setSearch('checkedArriveStations', Object.keys(checkedArriveStations).join())
      .setSearch('departTimeStart', departTimeStart)
      .setSearch('departTimeEnd', departTimeEnd)
      .setSearch('arriveTimeStart', arriveTimeStart)
      .setSearch('arriveTimeEnd', arriveTimeEnd)
      .toString()
    
    fetch(url)
      .then(res => res.json())
      .then(result => {
        const {
          dataMap: {
            directTrainInfo: {
              trains,
              filter: {
                ticketType,
                trainType,
                depStation,
                arrStation
              }
            }
          }
        } = result

        dispatch(setTrainList(trains))
        dispatch(setTicketTypes(ticketType))
        dispatch(setTrainTypes(trainType))
        dispatch(setDepartStations(depStation))
        dispatch(setArriveStations(arrStation))
      })

  }, [
      from,
      to,
      departDate,
      highSpeed,
      searchParsed,
      orderType,
      onlyTickets,
      checkedTicketTypes,
      checkedTrainTypes,
      checkedDepartStations,
      checkedArriveStations,
      departTimeStart,
      departTimeEnd,
      arriveTimeStart,
      arriveTimeEnd,
      dispatch
  ])

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  const {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next
  } = useNav(departDate, dispatch, prevDate, nextDate)

  if (!searchParsed) {
    return null
  }

  return (
    <div>
      <div className="header-wrapper">
        <Header title={`${from} → ${to}`} onBack={onBack}></Header>
      </div>
      <Nav
        date={departDate}
        isNextDisabled={isNextDisabled}
        isPrevDisabled={isPrevDisabled}
        next={next}
        prev={prev}
      ></Nav>
      <List list={trainList}></List>
      <Bottom></Bottom>
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  },
)(App);