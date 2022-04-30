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
  const [loading, setLoading] = useState(false);
  const [electionResult, setElectionResult] = useState([]);
  const [viewElectionResponse, setViewElectionResponse] = useState([]);
  const [totalElection, setTotalElection] = useState(null);
  const [showStartElection, setShowStartElection] = useState("");
  const [showStopElection, setShowStopElection] = useState("");
  const [chairmanAddress, setChairmainAddress] = useState("");
  const [showBanVoter, setShowBanVoter] = useState("");
  const [showUnBanVoter, setShowUnBanVoter] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [activities, setActivities] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allAddress, setAllAddress] = useState([]);
  const [electionTime, setElectionTime] = useState(null);
  // const [toggleRender, setToggleRender] = useState(false);

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

  const getTimeleft = async (electionId) => {
    let time;
    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract();

      let tx = await contract.electionTimeLeft(electionId);

      setElectionTime(await tx.toNumber());
      time = await tx.toNumber();
    } catch (err) {
      time = 0;
      try {
        const { message } = err.error;
        let errorMsg = message.split(":")[1];
        setGeneralError(errorMsg);
      } catch (error) {
        console.log(err.reason);
      }
    }
    return time;
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
  const viewResult = React.useCallback(async (electionId) => {
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
      let errReason = err.reason;
      console.log(errReason);
      setGeneralError(errReason);
    }
  });

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
        address: address,
      };
      setProfileDetails(res);
     setAllUsers((prevState) => ([ ...prevState, res ]));
    } catch (err) {
      console.log(err.reason);
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
      // setToggleRender((prevState) => !prevState);
    } catch (err) {
      console.log(err.reason);
    }
  };
  //stop electionstartedAt: tx.startedAt,
            // stoppedAt: tx.stoppedAt,
  const stopElection = async (electionId) => {
    //for starting election and stoping election

    try {
      // let contract = getProviderContractOrSignerContract()
      const contract = await getProviderContractOrSignerContract(true);

      let tx = await contract.stopElection(electionId);
      console.log("election stopped", tx);
      setShowStopElection(`The election with id ${electionId} has stoped`);
      // setToggleRender((prevState) => !prevState);
    } catch (err) {
      console.log(err.reason);
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
        // setToggleRender((prevState) => !prevState);
      });
      viewResult(electionId);
    } catch (err) {
      console.log(err.reason);
    }
  };

  // function to cast a vote on a proposal
  const castVote = React.useCallback(
    async (castElectionId, proposals, proposal) => {
      const proposalIdex = proposals.indexOf(proposal);
      try {
        // let contract = getProviderContractOrSignerContract(true)
        const contract = await getProviderContractOrSignerContract(true);
        let response = await contract.castVote(castElectionId, proposalIdex);

        console.log(response);
        contract.on("VoteCasted", (electId, address) => {
          console.log("u casted a vote", electId, address);
        });
      } catch (err) {
        try {
          const { message } = err.error;
          let errorMsg = message.split(":")[1];
          setGeneralError(errorMsg);
        } catch (error) {
          console.log(err.reason);
        }
      }
    }
  );

  // ban and un ban
  const banVoter = async (voterAddress) => {
    try {
      // let contract = getProviderContractOrSignerContract(true)
      const contract = await getProviderContractOrSignerContract(true);
      let response = await contract.banVoter(voterAddress);

      console.log(response);
      contract.on("BanVoter", (name, voter) => {
        console.log(`the voter ${name} with address ${voter} has being band`);
        // setToggleRender(prevState => !prevState)
        setShowBanVoter(
          `the voter ${name} with address ${voter} has being band`
        );
      });
    } catch (err) {
      try {
        const { message } = err.error;
        let errorMsg = message.split(":")[1];
        setGeneralError(errorMsg);
      } catch (error) {
        console.log(err.reason);
        setGeneralError(err.reason);
      }
    }
  };
  const unbanVoter = async (voterAddress) => {
    try {
      // let contract = getProviderContractOrSignerContract(true)
      const contract = await getProviderContractOrSignerContract(true);
      let response = await contract.unbanVoter(voterAddress);

      console.log(response);
      contract.on("UnbanVoter", (name, voter) => {
        // setToggleRender(prevState => !prevState)
        console.log(`the voter ${name} with address ${voter} has being unban`);
        setShowUnBanVoter(
          `the voter ${name} with address ${voter} has being unban`
        );
      });
    } catch (err) {
      try {
        const { message } = err.error;
        let errorMsg = message.split(":")[1];
        setGeneralError(errorMsg);
      } catch (error) {
        console.log(err.reason);
      }
    }
  };
  //adding directors
  const addDirector = async (directorDetails) => {
    try {
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      setLoading(true);
      const tx = await contract.addDirector(
        directorDetails.name,
        directorDetails.address
      );
      tx.wait();
      setLoading(false);
      console.log(tx);
      contract.on("DirectorCreated", (dName, address) => {
        console.log(
          `a director with name: ${dName} and address ${address} is created`
        );
      });
    } catch (err) {
      setLoading(false);
      try {
        const { message } = err.error;
        let errorMsg = message.split(":")[1];
        setGeneralError(errorMsg);
      } catch (error) {
        console.log(err.reason);
      }
    }
  }

  //add teacher
  const addTeacher = async (teacherDetails) => {
    try {
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      setLoading(true);
      const tx = await contract.addTeacher(
        teacherDetails.name,
        teacherDetails.address
      );
      tx.wait();
      setLoading(false);
      console.log(tx);
      contract.on("TeacherCreated", (Tname, address) => {
        console.log(
          `a director with name: ${Tname} and address ${address} is created`
        );
      });
    } catch (err) {
      console.log(allUsers)
      setLoading(false);
      try {
        const { message } = err.error;
        let errorMsg = message.split(":")[1];
        setGeneralError(errorMsg);
      } catch (error) {
        console.log(err.reason);
      }
    }
  }
  //add student
  const addStudent = async (studentDetails) => {
    try {
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      setLoading(true);
      const tx = await contract.addStudent(
        studentDetails.name,
        studentDetails.address
      );
      tx.wait();
      setLoading(false);
      console.log(tx);
      contract.on("StudentCreated", (Sname, address) => {
        console.log(
          `a director with name: ${Sname} and address ${address} is created`
        );
      });
    } catch (err) {
      setLoading(false);
      try {
        const { message } = err.error;
        let errorMsg = message.split(":")[1];
        setGeneralError(errorMsg);
      } catch (error) {
        console.log(err.reason);
      }
    }
  }
  //add weight
  const addWeight = async (weight) => {
    try {
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      setLoading(true);
      const tx = await contract.setWeight(weight.stakeHolder, weight.number);
      tx.wait();
      setLoading(false);
      console.log(tx);
    } catch (err) {
      setLoading(false);
      try {
        const { message } = err.error;
        let errorMsg = message.split(":")[1];
        setGeneralError(errorMsg);
      } catch (error) {
        console.log(err.reason);
      }
    }
  }
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
            // startedAt: tx.startedAt,
            // stoppedAt: tx.stoppedAt,
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
        addWeight,
        //adding staff and student
        addDirector,
        addStudent,
        addTeacher,
        loading,
        profileDetails,
        compileResults,
        setGeneralError,

        getTimeleft,
        electionTime,

        castVote,
        banVoter,
        unbanVoter,
        showBanVoter,
        showUnBanVoter,
        chairmanAddress,
        showStartElection,
        showStopElection,

        //getting all users
        allUsers,
        allAddress,
        setAllAddress,
        //error handle
        generalError,
        //activities
        activities,
        setActivities,
      }}
    >
      {props.children}
    </electionContext.Provider>
  );
};

export default ViewElectionContext;
