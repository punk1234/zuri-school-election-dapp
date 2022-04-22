import React from "react";
import Carousel from "./helpers/Carousel"
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
   <div>
    <Carousel />
     <div className="container-lg bg-light justify-content-center">
      <h4>Welcome</h4>
     </div>
   </div>
  );
}
