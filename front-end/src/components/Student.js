import { useContext } from "react";
import { electionContext } from "../context/ViewElectionContext";
import Election from "./helpers/Election";

export default function Student() {
  const { profileDetails } = useContext(electionContext);
  return (
    <div className="row my-5">
      <div className="col-md-4">
        <h2>Display content</h2>
        <p className="lead">Student</p>
        <h4>{profileDetails.name}</h4>
      </div>
      <div className="col-md-8">
        {profileDetails.canVote ? (
          <p>You are not allowed to vote</p>
        ) : (
          <Election />
        )}
      </div>
    </div>
  );
}
