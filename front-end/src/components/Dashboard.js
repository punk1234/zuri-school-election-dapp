import React, { useContext } from "react";
import { electionContext } from "../context/ViewElectionContext";
import NoticeBoard from "./NoticeBoard";
import TeacherDirector from "./Teacher";
import Student from "./Student";
import Admin from "./Admin";
import Loading from "./helpers/Loading";
export default function Dashboard() {
  const { profileDetails } = useContext(electionContext);

  const display = () => {
    switch (profileDetails.userType) {
      case "teacher":
        return <TeacherDirector />;
      case "director":
        return <TeacherDirector />;
      case "chairman":
        return <Admin />;

      default:
        return <Student />;
    }
  };
  return (
    <div className="container-lg bg-light justify-content-center">
      {profileDetails ? (
        <div className="row  g-3">
          <div className="col-md-9">{display()}</div>
          <div className="col-md-3">
            <NoticeBoard />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
