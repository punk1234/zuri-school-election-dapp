import { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";

export default function Student() {
    const { getProviderContractOrSignerContract } = useContext(
        providerSignerContext
      );
      const [loading, setLoading] = useState(false);
  return (
    <div>Student</div>
  )
}
