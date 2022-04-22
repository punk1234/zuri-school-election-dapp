import React from 'react'
import NoticeBoard from './NoticeBoard'
import TeacherDirector from './Teacher'

export default function Dashboard() {
  return (
    <div className="container-lg bg-light justify-content-center">
      <div className="row  g-3">
        <div className="col-md-9">
          {/* <Header /> */}
          <TeacherDirector />
          {/* <Admin /> */}
        </div>
        <div className="col-md-3">
          <NoticeBoard />
        </div>
      </div>
    </div>
  )
}
