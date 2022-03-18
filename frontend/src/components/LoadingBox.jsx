import React from 'react'
import spinner from './images/spinner.svg';

export default function LoadingBox() {
  return (
    <div className='loading-box'>
      <img src={spinner} alt="Spinner" />
    </div>
  )
}
