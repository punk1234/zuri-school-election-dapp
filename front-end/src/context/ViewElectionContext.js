
import React, { useContext, createContext, useState, useEffect } from "react";
import { providerSignerContext } from "./ProviderOrSignerContext";

export const electionContext = createContext();
export default function ViewElectionContext(props) {
  const { getProviderContractOrSignerContract } = useContext(
    providerSignerContext
  );
  const [viewElectionResponse, setViewElectionResponse] = useState([]);
  const [totalElection, setTotalElection] = useState(null);
  // function to view an election
  const electionCount = async () => {
    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract();
      let tx = await contract.electionCount();

      setTotalElection(await tx.toNumber());
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };

  electionCount();
  useEffect(() =>{
    const viewElection = async () => {
    electionCount()
    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract();
      let response = [];
      for (let i = 0; i < totalElection ; i++) {
        console.log(i)
        let tx = await contract.viewElection(i);
        let data = {
          id: i,
          name: tx.name,
          proposals: tx.props,
          isActive: tx.isActive,
          isComputed: tx.isComputed,
        };
        response.push(data)
      }
      setViewElectionResponse(response)
      console.log(response)

    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };
  viewElection()
  }, [totalElection])
  return (
    <electionContext.Provider
      value={{ viewElectionResponse, totalElection, electionCount }}
    >
      {props.children}
    </electionContext.Provider>
  );
}
