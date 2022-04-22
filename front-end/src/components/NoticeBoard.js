import React, { useContext } from "react";
import { electionContext } from "../context/ViewElectionContext";

export default function NoticeBoard() {
  const {electionResult, showStartElection, showStopElection } = useContext(electionContext);

  const displayResult = electionResult.map((val) => {
    return (
      <div key={val.electionName} className="card">
        <h4 className="card-title">{val.electionName}</h4>
        <h6 class="card-subtitle mb-1 text-muted">{val.proposalName}</h6>
        <div className="card-body">
          <p>The total vote count is {val.voteCount}</p>
        </div>
      </div>
    );
  });
  return (
    <div className="row">
      <div className="col-12 rounded">
        <img
          className="img-fluid"
          src="https://img.freepik.com/free-vector/people-vote-el…oosing-politician-candidate-white_109722-1131.jpg"
          alt="notice illustrator"
        />
        <h4>Notice Board</h4>
      </div>
      <div className="col-12 my-3">
        <p>content</p>
        {showStartElection && <p className="lead">{showStartElection}</p>}
        {showStopElection && <p className="lead">{showStopElection}</p>}
      </div>

      <div className="col-12">
        <h3>Eection Result</h3>
        {!electionResult ? <div>{ displayResult }</div> : <p>No Result </p>}
      </div>
    </div>
  );
}
