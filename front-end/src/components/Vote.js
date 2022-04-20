import React from 'react'
import NoticeBoard from './NoticeBoard'

export default function Vote() {
  return (
    <div className='container-lg bg-light justify-content-center'>
        <div className="row ">
    <div className="col-md-9">
    <p>Vote</p>
    </div>
    <div className="col-md-3">
      <NoticeBoard />
    </div>
    
  </div>
    </div>
  )
}
