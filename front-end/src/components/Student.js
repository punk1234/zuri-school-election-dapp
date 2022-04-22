
import { useContext } from "react";
import { electionContext } from "../context/ViewElectionContext";
import Election from "./helpers/Election";
// =======
// import { ethers } from "ethers";
// import { BigNumber } from "ethers";
// import { useContext, useState } from "react";
// import {abi, CONTRACT_ADDRESS} from "../constants/index";
// import { providerSignerContext } from "../context/ProviderOrSignerContext";
// >>>>>>> dev


export default function Student() {

  const { profileDetails } = useContext(electionContext);
  return (
    <div className="row my-5">
      <div className="col-md-4">
        <h2>Display content</h2>
        <p className="lead">Student</p>
        <h4>{profileDetails.name}</h4>
      </div>
      <div className="col-md-8">
        {profileDetails.canVote ? (
          <p>You are not allowed to vote</p>
        ) : (
          <Election />
        )}
      </div>
    </div>
  );
}
// =======

//   const [electionId, setElectionId] = useState(0);
//   const [proposalId, setProposalId] = useState(0);
  
//   const { getProviderContractOrSignerContract } = useContext(
//       providerSignerContext
//     );
//   const [loading, setLoading] = useState(false);

//   // function to cast a vote on a proposal
//   const castVote = async () => {
//       try{
//         const { ethereum } = window;
//         const provider = new ethers.providers.Web3Provider(ethereum);

//         const signer = provider.getSigner();
//         const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    
//         const electionIdBigNumber = BigNumber.from(electionId);
//         const proposalIdBigNumber = BigNumber.from(proposalId);

//         let response = await contract.castVote(electionIdBigNumber, proposalIdBigNumber);
//         console.log(response);
//       }
//       catch(error){
//           console.log(error);
//       }
//   }

//   return (
//     <div className="student-container">
//       <div className="cast-vote-container">
//           <h1>Cast Vote</h1>

//           <input 
//             type="number"
//             id="election-id"
//             onChange={(e) =>(setElectionId(e.target.value))}
//             value={electionId}
//             placeholder="enter election id"
//           />

//           <label htmlFor="election-id">Election ID</label>
//           <input 
//             type='number'
//             id="proposal-id"
//             onChange={(e) =>(setProposalId(e.target.value))}
//             value={proposalId}
//             placeholder="enter proposal id"
//           />

//           <label htmlFor="proposal-id">Proposal ID</label>
          
//           <button onClick={castVote}>
//             Cast Vote
//           </button>
//       </div> 
//     </div>
//   );
  
// }
