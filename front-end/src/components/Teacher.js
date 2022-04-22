import React, { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
import { BigNumber } from "ethers";
import { resultContext } from "../context/ViewResultContext";
import { electionContext } from "../context/ViewElectionContext";
import Loading from "./helpers/Loading"
export default function TeacherDirector() {
  const { getProviderContractOrSignerContract } = useContext(
    providerSignerContext
  );
  const [loading, setLoading] = useState(false);
  const { viewResult } = useContext(resultContext);
  const { viewElection, electionCount } = useContext(electionContext);
  //elections id for each components
  const [electionId, setElectionId] = useState(0);
  const [castElectionId, setCastElectionId] = useState(0);
  const [compileElectionId, setCompileElectionId] = useState(0);
  const [resultElectionId, setResultElectionId] = useState(0);
  const [electionDetails, setElectionDetails] = useState({});

  const [proposalId, setProposalId] = useState(0);

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
        electionCount()
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

  // function to cast a vote on a proposal
  const castVote = async () => {
    try {
      // let contract = getProviderContractOrSignerContract(true)
      const electionIdBigNumber = BigNumber.from(castElectionId);
      const proposalIdBigNumber = BigNumber.from(proposalId);
      const contract = await getProviderContractOrSignerContract(true);
      let response = await contract.castVote(
        electionIdBigNumber,
        proposalIdBigNumber
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // function to compile the results of an election
  const compileResults = async () => {
    try {
      // let contract = getProviderContractOrSignerContract(true)
      const electionIdBigNumber = BigNumber.from(electionId);
      const contract = await getProviderContractOrSignerContract(true);
      let tx = await contract.compileResults(electionIdBigNumber);
      window.alert("Results compiled");

      console.log(tx);
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };

  return (
    <div className="row my-5">
    
      <div className="col-md-4">
      {loading && <Loading />}
        <h2>Create election</h2>
        <form onSubmit={handleElectionCreation}>
          <label>Election Name: </label>
          <input
            type="text"
            name="name"
            value={electionDetails.name || ""}
            placeholder="enter election name"
            onChange={handleElectionInputs}
          />
          <label>Enter a proposal name</label>
          <input
            type="text"
            name="proposalName"
            placeholder="enter proposal name"
            onChange={handleElectionInputs}
            value={electionDetails.proposalName || ""}
          />
          <label htmlFor="hours">Hours</label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={electionDetails.hours || ""}
            placeholder="enter hours"
            onChange={handleElectionInputs}
          />
          <label>Describe</label>
          <textarea
            name="description"
            value={electionDetails.description || ""}
            placeholder="enter election description"
            onChange={handleElectionInputs}
          />
          <button type="submit">Create Election</button>
        </form>
      </div>
      <div className="col-md-8">
        <div className="view-election-container">
          <h1>View Election</h1>

          <button onClick={viewElection}>View Election</button>
        </div>

        <div className="cast-vote-container">
          <h1>Cast Vote</h1>
          <input
            type="number"
            id="election-id"
            onChange={(e) => setCastElectionId(e.target.value)}
            value={castElectionId}
            placeholder="enter election id"
          />
          <label htmlFor="election-id">Election ID</label>
          <input
            type="number"
            id="proposal-id"
            onChange={(e) => setProposalId(e.target.value)}
            value={proposalId}
            placeholder="enter proposal id"
          />
          <label htmlFor="proposal-id">Proposal ID</label>
          <button onClick={castVote}>Cast Vote</button>
        </div>

        <div className="compile-results-container">
          <h1>Compile Results</h1>
          <input
            type="number"
            id="election-id"
            onChange={(e) => setCompileElectionId(e.target.value)}
            value={compileElectionId}
            placeholder="enter election id"
          />
          <label htmlFor="election-id">Election ID</label>
          <button onClick={compileResults}>Compile Results</button>
        </div>

        <div className="view-result-container">
          <h1>View Results</h1>
          <input
            type="number"
            onChange={(e) => setResultElectionId(e.target.value)}
            value={resultElectionId}
            placeholder="enter election id"
          />
          <button
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
