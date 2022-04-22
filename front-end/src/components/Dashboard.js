import React, { useContext } from "react";
import { electionContext } from "../context/ViewElectionContext";
import NoticeBoard from "./NoticeBoard";
import TeacherDirector from "./Teacher";
import Student from "./Student";
import Admin from "./Admin";
import Loading from "./helpers/Loading";
import Home from "./Home";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
export default function Dashboard() {
  const { profileDetails, chairmanAddress } = useContext(electionContext);
 const { address } = useContext(providerSignerContext);
  const display = () => {
    switch (profileDetails.userType) {
      case "student":
        return <Student />;
      case "teacher":
        return <TeacherDirector />;
      
      case "director":
        return <TeacherDirector />;
      default:
        return <Home />;
    }
  };
  return (
    <div className="container-lg bg-light justify-content-center">
      {profileDetails ? (
        <div className="row  g-3">
          <div className="col-md-9">
           {chairmanAddress === address ? <Admin /> : display}
          </div>
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
