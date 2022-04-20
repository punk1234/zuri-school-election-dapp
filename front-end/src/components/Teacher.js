
import { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";

export default function Teacher() {
    const { getProviderContractOrSignerContract } = useContext(
        providerSignerContext
      );
      const [loading, setLoading] = useState(false);
  return (
    <div>Teacher</div>
  )
}
