import React, { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
import { resultContext } from "../context/ViewResultContext";
import { electionContext } from "../context/ViewElectionContext";
import Loading from "./helpers/Loading";
import Election from "./helpers/Election";
export default function TeacherDirector() {
  const { getProviderContractOrSignerContract } = useContext(
    providerSignerContext
  );
  const [loading, setLoading] = useState(false);
  const { viewResult } = useContext(resultContext);
  const { electionCount } = useContext(electionContext);
  const [resultElectionId, setResultElectionId] = useState(0);
  const [electionDetails, setElectionDetails] = useState({});

  // function to create an election
  const handleElectionInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setElectionDetails((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleElectionCreation = async (e) => {
    e.preventDefault();
    const proposalName = electionDetails.proposalName.split(",");
    const proposalNumber = proposalName.length;
    console.log(proposalName);
    try {
      setLoading(true);
      const contract = await getProviderContractOrSignerContract(true);
      let response = await contract.createElection(
        electionDetails.name,
        proposalNumber,
        electionDetails.description,
        proposalName,
        electionDetails.hours
      );

      console.log(response);
      //listening for event emited
      contract.on("BallotCreated", (id, name, expireTime) => {
        setLoading(false);
        console.log("ballot created", id, name, expireTime);
        electionCount();
      });
      setElectionDetails({});
    } catch (err) {
      setLoading(false);
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };

  return (
    <div className="row my-5">
      <div className="col-md-3">
        {loading && <Loading />}
        <p className="lead">Teacher/Director</p>
        <h2>Create election</h2>
        <form onSubmit={handleElectionCreation}>
          <label className="form-label">Election Name: </label>
          <input 
          className="form-control"
            type="text"
            name="name"
            value={electionDetails.name || ""}
            placeholder="enter election name"
            onChange={handleElectionInputs}
          />
          <label className="form-label">Enter a proposal name</label>
          <input 
          className="form-control"
            type="text"
            name="proposalName"
            placeholder="enter proposal name"
            onChange={handleElectionInputs}
            value={electionDetails.proposalName || ""}
          />
          <label className="form-label" htmlFor="hours">Hours</label>
          <input 
          className="form-control"
            type="number"
            id="hours"
            name="hours"
            value={electionDetails.hours || ""}
            placeholder="enter hours"
            onChange={handleElectionInputs}
          />
          <label className="form-label">Describe</label>
          <textarea 
          className="form-control"
            name="description"
            value={electionDetails.description || ""}
            placeholder="enter election description"
            onChange={handleElectionInputs}
          />
          <button type="submit" className="btn btn-secondary">Create Election</button>
        </form>
      </div>
      <div className="col-md-9">
        <Election />

        <div className="view-result-container">
          <h1>View Results</h1>
          <input 
          className="form-control"
            type="number"
            onChange={(e) => setResultElectionId(e.target.value)}
            value={resultElectionId}
            placeholder="enter election id"
          />
          <button className="btn btn-secondary"
            onClick={() => {
              viewResult(resultElectionId);
            }}
          >
            View Result
          </button>
        </div>
      </div>
    </div>
  );
}
