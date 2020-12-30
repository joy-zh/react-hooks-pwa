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

import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity
} from './actions'

function App(props) {
  const {
    from,
    to,
    isCitySelectorVisible,
    cityData,
    isLoadingCityData,
    dispatch
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
  }, [])

  const citySeletorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideCitySelector,
      fetchCityData,
      onSelect: setSelectedCity
    }, dispatch)
  }, [])

  return (
    <div>
      <div className="header-wrapper">
        <Header title="火车票" onBack={onBack}></Header>
      </div>
      <form className="form">
        <Journey
          from={from}
          to={to}
          {...cbs}
        ></Journey>
        <DepartDate></DepartDate>
        <HighSpeed></HighSpeed>
        <Submit></Submit>
        <CitySeletor
          show={isCitySelectorVisible}
          cityData={cityData}
          isLoading={isLoadingCityData}
          {...citySeletorCbs}
        ></CitySeletor>
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