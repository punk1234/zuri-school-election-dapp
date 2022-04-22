import { useContext } from "react";
import { providerSignerContext } from "../../context/ProviderOrSignerContext";
import { electionContext } from "../../context/ViewElectionContext";
import Loading from "./Loading";

export default function Election() {
  const {
    viewElectionResponse,
    startElection,
    stopElection,
    chairmanAddress,
    compileResults,
    castVote,
  } = useContext(electionContext);
  const { address } = useContext(providerSignerContext);
  const displayElection = viewElectionResponse.map((val) => {
    return (
      <div key={val.id} className="col-4">
        <div className="card">
          <div class="card-body">
            <h5 class="card-title">{val.name}</h5>
            <h6 class="card-subtitle mt-2 text-muted">Proposals</h6>
          </div>
          <ul class="list-group list-group-flush">
            {val.proposals.map((prop) => {
              return (
                <li
                  key={prop}
                  class="list-group-item d-flex justify-content-between"
                >
                  {prop}
                  <button
                    onClick={() => castVote(val.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    vote
                  </button>
                </li>
              );
            })}
          </ul>
          <div class="card-body">
            {chairmanAddress === address && (
              <div>
                {val.isActive ? (
                  <button
                    onClick={() => startElection(val.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Stop Eelction
                  </button>
                ) : (
                  <button
                    onClick={() => stopElection(val.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Start Eection
                  </button>
                )}
                <button
                  onClick={() => compileResults(val.id)}
                  className="btn btn-secondary btn-sm"
                >
                  compile Result
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });
  return (
    <div className="row justify-content-center">
      <h3>Voting Section</h3>
      {viewElectionResponse <= 0 && <Loading />}
      {displayElection}
    </div>
  );
}
