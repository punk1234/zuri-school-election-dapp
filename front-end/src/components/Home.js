import React from "react";
import Header from "./Header";
import { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
import TeacherDirector from "./Teacher";
import Admin from "./Admin";
import NoticeBoard from "./NoticeBoard";

export default function Home() {
  const { getProviderContractOrSignerContract, address } = useContext(
    providerSignerContext
  );
  const [loading, setLoading] = useState(false);
  ///sample code of how to use it

  return (
    <div className="container-lg bg-light justify-content-center">
      <div className="row  g-3">
        <div className="col-md-9">
          {/* <Header /> */}
          <TeacherDirector />
          {/* <Admin /> */}
        </div>
        <div className="col-md-3">
          <NoticeBoard />
        </div>
      </div>
    </div>
  );
}
