import { BigNumber } from 'ethers'
import React, { useContext, createContext, useState } from 'react'
import { providerSignerContext } from './ProviderOrSignerContext';

export const resultContext = createContext()
export default function ViewResultContext(props) {
    const { getProviderContractOrSignerContract } = useContext(
    providerSignerContext
  );

        const [electionResult, setElectionResult] = useState({})

    // function to view the results of an election
    const viewResult = async (electionId) => {
        try {
            // let contract = getProviderContractOrSignerContract()
            const electionIdBigNumber = BigNumber.from(electionId)
            const contract = await getProviderContractOrSignerContract()
            console.log(contract)
            let tx = await contract.viewResult(electionIdBigNumber)

            let response = {
                electionName: tx.electionName,
                proposalName: tx.proposalName,
                voteCount: tx.voteCount.toNumber(),
            }
            setElectionResult(response)    
        }
        catch(err){
            if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
        }

    }
  return (
      <resultContext.Provider value={{electionResult, setElectionResult, viewResult}}>
    {props.children}
    </resultContext.Provider>
  )
}
