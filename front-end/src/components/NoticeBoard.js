import React, { useContext } from 'react'
import { resultContext } from '../context/ViewResultContext'

export default function NoticeBoard() {
  const { electionResult } = useContext(resultContext)
  return (
   <div className='row'>
     <div className="col-12 rounded">
       <img className="img-fluid" src="https://personal-financial.com/wp-content/uploads/…n-and-Voting-a-False-Good-Idea-TheCoinTribune.jpg" alt="notice illustrator"/>
      <h4>Notice Board</h4>
     </div>
     <div className="col-12">
       <p>content</p>
     </div>

   </div>
  )
}
