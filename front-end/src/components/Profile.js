import { useContext } from "react";
import { electionContext } from "../context/ViewElectionContext";
import NoticeBoard from "./NoticeBoard";

export default function Profile() {
 
  const { profileDetails } = useContext(electionContext)
  return (
    //past it heare
   <h1>clean this</h1>
  );
}
