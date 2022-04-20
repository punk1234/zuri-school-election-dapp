import { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";

export default function Profile() {
    const { getProviderContractOrSignerContract } = useContext(
        providerSignerContext
      );
      const [loading, setLoading] = useState(false);
  return (
    <div>Profile</div>
  )
}
