import React, { Component } from 'react'
import './FingeringIndicator.css'
import FingeringText from './FingeringText'


class FingeringIndicator extends Component {
  render() {
    return (
      <div className='hands-container'>
        <div className='hands'>
          { this.props.showWord ?
            <FingeringText {...this.props} />
            :
            ''
          }
          { this.props.fingeringObject.fingerSet.map((finger, index) => (
            <div key={index} className={'finger f' + finger} />
          )) }
        </div>
      </div>
    )
  }
}

export default FingeringIndicator
