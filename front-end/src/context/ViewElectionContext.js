import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { providerSignerContext } from "./ProviderOrSignerContext";


export const electionContext = createContext();
const ViewElectionContext = (props) => {
  const { getProviderContractOrSignerContract, address, walletConnected } =
    useContext(providerSignerContext);

  const [electionResult, setElectionResult] = useState([]);
  const [viewElectionResponse, setViewElectionResponse] = useState([]);
  const [totalElection, setTotalElection] = useState(null);
  const [showStartElection, setShowStartElection] = useState("");
  const [showStopElection, setShowStopElection] = useState("");
  const [chairmanAddress, setChairmainAddress] = useState("");
  const [showBanVoter, setShowBanVoter] = useState("");
  const [showUnBanVoter, setShowUnBanVoter] = useState("");

  //profile details
  const [profileDetails, setProfileDetails] = useState(null);
  // function to view an election
  const electionCount = async () => {
    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract();
      let tx = await contract.electionCount();

      setTotalElection(await tx.toNumber());
      getChairmanAddress();
      getUserAddressDetails(address);
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };

  //get charman address
  const getChairmanAddress = async () => {
    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract();
      let tx = await contract.chairperson();
      setChairmainAddress(tx);
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };

  // function to view the results of an election
  const viewResult = async (electionId) => {
    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      let tx = await contract.viewResult(electionId);

      let response = {
        electionName: tx.electionName,
        proposalName: tx.proposalName,
        voteCount: tx.voteCount.toNumber(),
      };
      setElectionResult((prevState) => {
        return [...prevState, response];
      });
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };

  //using the address to get the user details
  const getUserAddressDetails = useCallback(async (address) => {
    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract();
      let tx = await contract.whoami(address);
      let res = {
        name: tx.name,
        canVote: tx.canVote,
        userType: tx.usertype,
      };
      setProfileDetails(res);
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
      console.error(err);
    }
  }, []);

  //start election
  const startElection = async (electionId) => {
    //for starting election and stoping election

    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract(true);

      let tx = await contract.startElection(electionId);
      console.log("election started", tx);
      setShowStartElection(`The election with id ${electionId} has started`);
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };
  //stop election
  const stopElection = async (electionId) => {
    //for starting election and stoping election

    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract(true);

      let tx = await contract.stopElection(electionId);
      console.log("election stopped", tx);
      setShowStopElection(`The election with id ${electionId} has stoped`);
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };

  //compile result
  const compileResults = async (electionId) => {
    try {
      const contract = await getProviderContractOrSignerContract(true);
      let tx = await contract.compileResults(electionId);
      window.alert("Results compiled");

      console.log(tx);
      contract.on("BallotResultCompiled", (electId, electName, time) => {
        console.log("result compiled", electId, electName, time);
      });
      viewResult(electionId);
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };

  // function to cast a vote on a proposal
  const castVote = async (castElectionId, proposals, proposal) => {
    const proposalIdex = proposals.indexOf(proposal);
    try {
      // let contract = getProviderContractOrSignerContract(true)
      const contract = await getProviderContractOrSignerContract(true);
      let response = await contract.castVote(castElectionId, proposalIdex);

      console.log(response);
      contract.on("VoteCasted", (electId, address) => {
        console.log("u casted a vote", electId, address);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ban and un ban

  electionCount();
  useEffect(() => {
    const viewElection = async () => {
      electionCount();
      try {
        // let contract = getProviderContractOrSignerContract()
        const contract = await getProviderContractOrSignerContract();
        let response = [];
        for (let i = 0; i < totalElection; i++) {
          let tx = await contract.viewElection(i);
          let data = {
            id: i,
            name: tx.name,
            proposals: tx.props,
            isActive: tx.isActive,
            isComputed: tx.isComputed,
          };
          response.push(data);
        }
        setViewElectionResponse(response);
        console.log(response);
      } catch (err) {
        if (err.error === undefined) {
          console.log("not connected");
        } else {
          console.error(err.error);
        }
      }
    };
    viewElection();
  }, [totalElection, walletConnected]);
  return (
    <electionContext.Provider
      value={{
        electionResult,
        setElectionResult,
        viewResult,
        viewElectionResponse,
        totalElection,
        electionCount,
        startElection,
        stopElection,
        profileDetails,
        compileResults,

        castVote,
        // banVote,
        // unbanVoter,
        showBanVoter,
        showUnBanVoter,
        chairmanAddress,
        showStartElection,
        showStopElection,
      }}
    >
      {props.children}
    </electionContext.Provider>
  );
};

export default ViewElectionContext;
