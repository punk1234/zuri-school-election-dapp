
import React from 'react'
import Header from './Header'
import { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";

export default function Home() {
    const { getProviderContractOrSignerContract, address } = useContext(
        providerSignerContext
      );
      const [loading, setLoading] = useState(false);
      ///sample code of how to use it
  const testing = async () => {
    //

    try {
      const providerContract = await getProviderContractOrSignerContract();

      setLoading(true);
      const tx = await providerContract.roles(
        "USER",
        address
      );
      // tx.wait() is only used for signer
      setLoading(false);
      console.log(tx);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  return (
    <Header />
  )
}
