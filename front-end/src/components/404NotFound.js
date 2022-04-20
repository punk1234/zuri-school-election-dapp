import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound () {
  return (
    <main>
      <div className='ps-5 mt-5'><h3>404 NOT FOUND</h3></div>
      <div className="container">
        <div className="row my-5 align-items-center justify-content-center">
        <div className="col-md-4">
          <img className='img-fluid' src="https://wizardly-khorana-19e375.netlify.app/Scarecrow.png" alt="" />
        </div>
        <div className="col-md-4">
          <p className=" display-2">I have bad news for you</p>
          <p className="lead">
            The page you are looking for might be removed or is temporarily
            unavailable
          </p>
          <div></div>
          <Link to={"/"} className='btn btn-outline-secondary btn-lg'>BACK TO HOMEPAGE</Link>
        </div>

        </div>
      </div>
    </main>
  )
}
