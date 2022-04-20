import { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
import NoticeBoard from "./NoticeBoard";

export default function Profile() {
    const { getProviderContractOrSignerContract } = useContext(
        providerSignerContext
      );
      const [loading, setLoading] = useState(false);
  return (
   <div className="container-lg bg-light justify-content-center">
      <div className="row  g-3">
      <div className="col-md-9">
      <p>Profile</p>
      </div>
      <div className="col-md-3">
        <NoticeBoard />
      </div>
      
    </div>
   </div>
  )
}
