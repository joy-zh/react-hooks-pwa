import React,
{
  useState,
  useMemo,
  useEffect,
  memo,
  useCallback
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import './CitySelector.css'

// 一行城市 最小颗粒度
const CityItem = memo(function CityItem(props) {
  const {
    name,
    onSelect
  } = props

  return (
    <li className="city-li" onClick={() => onSelect(name)}>{ name }</li>
  )
})

CityItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

// 每个字母和对应的城市
const CitySection = memo(function CitySection(props) {
  const {
    title,
    cities = [],
    onSelect
  } = props

  return (
    <ul className="city-ul">
      <li className="city-li" key="title" data-cate={title}>{title}</li>
      {
        cities.map(city => {
          return (
            <CityItem
              key={city.name}
              onSelect={onSelect}
              name={city.name}
            />
          )
        })
      }
    </ul>
  )
})

CitySection.propTypes = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}

// 右侧字母列表
const AlphaIndex = memo(function AlphaIndex(props) {
  const {
    alpha,
    onClick
  } = props

  return (
    <i className="city-index-item" onClick={() => onClick(alpha)}>{alpha}</i>
  )
})

const alphabet = Array.from(new Array(26), (ele, index) => {
  return String.fromCharCode(65 + index)
})

AlphaIndex.propTypes = {
  alpha: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

// 大列表
const CityList = memo(function CityList(props) {
  const {
    sections,
    onSelect,
    toAlpha
  } = props

  return (
    <div className="city-list">
      <div className="city-cate">
        {
          sections.map(section => {
            return (
              <CitySection
                title={section.title}
                cities={section.citys}
                onSelect={onSelect}
                key={section.title}
              />
            )
          })
        }
        <div className="city-index">
          {
            alphabet.map(alpha => {
              return (
                <AlphaIndex key={alpha} alpha={alpha} onClick={toAlpha}></AlphaIndex>
              )
            })
          }
        </div>
      </div>
    </div>
  )
})

CityList.propTypes = {
  sections: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  toAlpha: PropTypes.func.isRequired
}

const SuggestItem = memo(function SuggestItem(props) {
  const {
    name,
    onClick
  } = props
  
  return (
    <li className="city-suggest-li" onClick={() => onClick(name)}>{name}</li>
  )
})

SuggestItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

const Suggest = memo(function Suggest(props) {
  const {
    searchKey,
    onSelect
  } = props

  const [result, setResult] = useState([])

  useEffect(() => {
    fetch('/rest/search?key=' + encodeURIComponent(searchKey))
      .then(res => res.json())
      .then(data => {
        const {
          result,
          searchKey: sKey
        } = data
        if (searchKey === sKey) {
          setResult(result)
        }
      })
  }, [searchKey])

  const fallBackResult = useMemo(() => {
    return result.length ? result : [{display: searchKey}]
  },[result, searchKey])
  
  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {
          fallBackResult.map(item => {
            return (
              <SuggestItem 
                key={item.display}
                name={item.display}
                onClick={onSelect}
              />
            )
          })
        }
      </ul>
    </div>
  )
})

Suggest.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

const CitySelector = memo(function CitySelector(props) {
  const {
    show,
    cityData,
    onBack,
    isLoading,
    fetchCityData,
    onSelect
  } = props

  const [searchKey, setSearchKey] = useState('');
  
  const key = useMemo(() => searchKey.trim(), [searchKey])

  useEffect(() => {
    if (!show || cityData || isLoading) {
      return
    }
    fetchCityData()
  }, [show, cityData, isLoading])

  // 点击字母跳转到对应列表
  const toAlpha = useCallback(alpha => {
    document.querySelector(`[data-cate='${alpha}']`).scrollIntoView()
  }, [])

  const outputCitySections = () => {
    if (isLoading) {
      return <div>loading</div>
    }
    if (cityData) {
      return (
        <CityList
          sections={cityData.cityList}
          onSelect={onSelect}
          toAlpha={toAlpha}
        />
      )
    }

    return <div>error</div>
  }

  return (
    <div className={classnames('city-selector', { hidden: !show })}>
      <div className="city-search">
        <div className="search-back" onClick={() => onBack()}>
          <svg width="42" height="42">
            <polyline
              points="25,13 16,21 25,29"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="search-input"
            placeholder="城市、车站的中文或拼音"
          />
        </div>
        <i
          className={classnames('search-clean',{ hidden: key.length === 0 })}
          onClick={() => setSearchKey('')}
        >&#xf063;</i>
      </div>
      {
        Boolean(key) && (
          <Suggest
            searchKey={key}
            onSelect={(key) => onSelect(key)}
          />
        )
      }
      { outputCitySections() }
    </div>
  )
})

CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}

export default CitySelector