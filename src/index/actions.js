export const ACTION_SET_FROM = 'ACTION_SET_FROM'
export const ACTION_SET_TO = 'ACTION_SET_TO'
export const ACTION_SET_ISCITYSELECTORVISIBLE = 'ACTION_SET_ISCITYSELECTORVISIBLE'
export const ACTION_SET_CURRENTSELECTINGLEFTCITY = 'ACTION_SET_CURRENTSELECTINGLEFTCITY'
export const ACTION_SET_CITYDATA = 'ACTION_SET_CITYDATA'
export const ACTION_SET_ISLOADINGCITYDATA = 'ACTION_SET_ISLOADINGCITYDATA'
export const ACTION_SET_ISDATESELECTORVISIBLE = 'ACTION_SET_ISDATESELECTORVISIBLE'
export const ACTION_SET_HIGHSPEED = 'ACTION_SET_HIGHSPEED'

export function setFrom(from) {
  return {
    type: ACTION_SET_FROM,
    payload: from
  }
}

export function setTo(to) {
  return {
    type: ACTION_SET_TO,
    payload: to
  }
}

export function setCityData(cityData) {
  return {
    type: ACTION_SET_CITYDATA,
    payload: cityData
  }
}
export function setIsLoadingCityData(isLoadingCityData) {
  return {
    type: ACTION_SET_ISLOADINGCITYDATA,
    payload: isLoadingCityData
  }
}

export function toggleHighSpeed() {
  return (dispatch, getState) => {
    const { highSpeed } = getState()
    dispatch({
      type: ACTION_SET_HIGHSPEED,
      payload: !highSpeed
    })
  }
}

export function showCitySelector(currentSelectingLeftCity) {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_ISCITYSELECTORVISIBLE,
      payload: true
    })
    dispatch({
      type: ACTION_SET_CURRENTSELECTINGLEFTCITY,
      payload: currentSelectingLeftCity
    })
  }
}

export function hideCitySelector() {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_ISCITYSELECTORVISIBLE,
      payload: false
    })
  }
}

export function setSelectedCity(city) {
  return (dispatch, getState)  => {
    const { currentSelectingLeftCity } = getState()
    if (currentSelectingLeftCity) {
      dispatch(setFrom(city))
    } else {
      dispatch(setTo(city))
    }

    dispatch(hideCitySelector())
  }
}

export function showDateSelector() {
  return {
    type: ACTION_SET_ISDATESELECTORVISIBLE,
    payload: true
  }
}

export function hideDateSelector() {
  return {
    type: ACTION_SET_ISDATESELECTORVISIBLE,
    payload: false
  }
}

export function exchangeFromTo() {
  return (dispatch, getState) => {
    const { from, to } = getState()
    dispatch(setFrom(to))
    dispatch(setTo(from))
  }
}

export function fetchCityData() {
  return (dispatch, getState) => {
    const { isLoadingCityData } = getState()

    if (isLoadingCityData) {
      return
    }

    const cache = JSON.parse(localStorage.getItem('city_data_cache') || '')
    if (Date.now() < cache.expires) {
      dispatch(setCityData(cache.data))
      return
    }

    dispatch(setIsLoadingCityData(true))

    fetch('/rest/cities?_' + Date.now())
      .then(res => res.json())
      .then(cityData => {
        dispatch(setCityData(cityData))

        localStorage.setItem('city_data_cache', JSON.stringify({
          expires: Date.now() + 60 * 1000,
          data: cityData
        }))

        dispatch(setIsLoadingCityData(false))
      })
      .catch(error => {
        dispatch(setIsLoadingCityData(false))
      })
  }
}
