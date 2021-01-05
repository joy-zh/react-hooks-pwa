import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './App.css'

import Header from '../common/Header.jsx'
import DepartDate from './DepartDate.jsx'
import HighSpeed from './HighSpeed.jsx'
import Journey from './Journey.jsx'
import Submit from './Submit.jsx'

import CitySeletor from '../common/CitySelector.jsx'
import DateSeletor from '../common/DateSelector.jsx'

import { h0 } from '../common/fp'

import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity,
  showDateSelector,
  hideDateSelector,
  setDepartDate,
  toggleHighSpeed
} from './actions'

function App(props) {
  const {
    from,
    to,
    isCitySelectorVisible,
    isDateSelectorVisible,
    cityData,
    isLoadingCityData,
    dispatch,
    departDate,
    highSpeed
  } = props
  // 避免header组件重复渲染
  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  const cbs = useMemo(() => {
    return bindActionCreators({
      exchangeFromTo,
      showCitySelector
    }, dispatch)
  }, [dispatch])

  const citySeletorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideCitySelector,
      fetchCityData,
      onSelect: setSelectedCity
    }, dispatch)
  }, [dispatch])

  const departDateCbs = useMemo(() => {
    return bindActionCreators({
      onClick: showDateSelector
    }, dispatch)
  }, [dispatch])

  const dateSelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideDateSelector
    }, dispatch)
  }, [dispatch])

  const highSpeedCbs = useMemo(() => {
    return bindActionCreators({
      toggle: toggleHighSpeed
    }, dispatch)
  }, [])

  const onSelectDate = useCallback((day) => {
    console.log(day)
    if (!day) return;
    if (day < h0()) return;

    dispatch(setDepartDate(day))
    dispatch(hideDateSelector())

  }, [])

  return (
    <div>
      <div className="header-wrapper">
        <Header title="火车票" onBack={onBack}></Header>
      </div>
      <form className="form" action="./query.html">
        <Journey
          from={from}
          to={to}
          {...cbs}
        ></Journey>
        <DepartDate
          time={departDate}
          {...departDateCbs}
        ></DepartDate>
        <HighSpeed {...highSpeedCbs} highSpeed={highSpeed}></HighSpeed>
        <Submit></Submit>
        <CitySeletor
          show={isCitySelectorVisible}
          cityData={cityData}
          isLoading={isLoadingCityData}
          {...citySeletorCbs}
        ></CitySeletor>
        <DateSeletor
          show={isDateSelectorVisible}
          {...dateSelectorCbs}
          onSelect={onSelectDate}
        ></DateSeletor>
      </form>
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