
import React, {useContext, useState} from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
import { BigNumber } from "ethers";
import { ethers } from "ethers";
import {abi, CONTRACT_ADDRESS} from "../constants/index"

export default function TeacherDirector() {

    const [electionId, setElectionId] = useState(0)
    const [proposalId, setProposalId] = useState(0)
    const [electionName, setElectionName] = useState("")
    const [proposalNumber, setProposalNumber] = useState(0)
    const [proposals, setProposals] = useState([])
    const [electionDescription, setElectionDescription] = useState("")
    const [hours, setHours] = useState(0)
    const [viewElectionResponse, setViewElectionResponse] = useState({})
    const [electionResult, setElectionResult] = useState({})
    const [proposalName, setProposalName] = useState("")
    

    // const {getProviderContractOrSignerContract} = useContext(providerSignerContext)
    
    // instanciating our contract. Since this component is only going to be displayed if a wallet is connected and the address is type teacher or director, we can assume an ethereum object is already available
    const {ethereum} = window
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)


    // function to create an election 
    const createElection = async () => {
        try{
            // convert proposal number and hours to BigNumber
            const proposalNumberBigNumber = BigNumber.from(proposalNumber)
            const hoursBigNumber =  BigNumber.from(hours)

            let response = await contract.createElection(electionName, proposalNumberBigNumber, electionDescription, proposals, hoursBigNumber)

            console.log(response)

            setElectionName("")
            setProposalNumber(0)
            setElectionDescription("")
            setProposals([])
            setHours(0)
        } catch(error){
            console.log(error)
        }

    }

    // function to cast a vote on a proposal
    const castVote = async () => {
        try{
            // let contract = getProviderContractOrSignerContract(true)
            const electionIdBigNumber = BigNumber.from(electionId)
            const proposalIdBigNumber = BigNumber.from(proposalId)

            let response = await contract.castVote(electionIdBigNumber, proposalIdBigNumber)

            console.log(response)
        }
        catch(error){
            console.log(error)
        }
    }

    // function to view an election
    const viewElection = async () => {
        try{
            // let contract = getProviderContractOrSignerContract()
            const electionIdBigNumber = BigNumber.from(electionId)

            let tx = await contract.viewElection(electionIdBigNumber)

            let response = {
                name: tx.name,
                proposals: tx.props,
                isActive: tx.isActive,
                isComputed: tx.isComputed,
            }
            setViewElectionResponse(response)
            console.log(response)

            
        }
        catch(error){
            console.log(error)
        }
    }

    // function to compile the results of an election
    const compileResults = async () => {
        try {
            // let contract = getProviderContractOrSignerContract(true)
            const electionIdBigNumber = BigNumber.from(electionId)

            let tx = await contract.compileResults(electionIdBigNumber)
            window.alert("Results compiled")

            console.log(tx)
        }
        catch(error){
            console.log(error)
        }
    }

    // function to view the results of an election
    const viewResult = async () => {
        try {
            // let contract = getProviderContractOrSignerContract()
            const electionIdBigNumber = BigNumber.from(electionId)

            let tx = await contract.viewResult(electionIdBigNumber)

            let response = {
                electionName: tx.electionName,
                proposalName: tx.proposalName,
                voteCount: tx.voteCount.toNumber(),
            }
            setElectionResult(response)    
        }
        catch(error){
            console.log(error)
        }

    }

    const handleAddProposal = async () => {
        try {
            setProposals([...proposals, proposalName])
            setProposalName("")
        } catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <div className="create-election-container">
                <h1>Create Election</h1>
                <input
                type="text"
                value={electionName}
                placeholder="enter election name"
                onChange = {(e) =>(setElectionName(e.target.value))}
                />
                <input 
                id="proposal-number"
                type="number"
                value={proposalNumber}
                onChange = {(e) => (setProposalNumber(e.target.value))}
                />
                <label htmlFor="proposal-number">Number of Proposals</label>
                <div className="proposal-names-container">
                    <h1>Enter a proposal name</h1>
                    <input 
                    type="text"
                    placeholder="enter proposal name"
                    onChange={(e) =>(setProposalName(e.target.value))}
                    value={proposalName}
                    />
                    <button
                    onClick={handleAddProposal}
                    >
                        Add Proposal
                    </button>
                </div>
                <textarea 
                value={electionDescription}
                placeholder="enter election description"
                onChange={(e) =>(setElectionDescription(e.target.value))}
                />
                <input 
                type="number"
                id="hours"
                value={hours}
                placeholder="enter hours"
                onChange={(e) =>(setHours(e.target.value))}
                />
                <label htmlFor="hours">Hours</label>
                <button
                onClick={createElection}
                >
                    Create Election
                </button>     
            </div>
            <div className="view-election-container">
                <h1>View Election</h1>
                <input 
                id="election-id"
                type="number"
                placeholder="enter election id"
                value={electionId}
                onChange={(e) =>(setElectionId(e.target.value))}
                />
                <label htmlFor="election-id">Election ID</label>
                <button
                onClick={viewElection}
                >
                    View Election
                </button>
            </div>

            <div className="cast-vote-container">
                <h1>Cast Vote</h1>
                <input 
                type="number"
                id="election-id"
                onChange={(e) =>(setElectionId(e.target.value))}
                value={electionId}
                placeholder="enter election id"
                />
                <label htmlFor="election-id">Election ID</label>
                <input 
                type='number'
                id="proposal-id"
                onChange={(e) =>(setProposalId(e.target.value))}
                value={proposalId}
                placeholder="enter proposal id"
                />
                <label htmlFor="proposal-id">Proposal ID</label>
                <button
                onClick={castVote}
                >
                    Cast Vote
                </button>
            </div>

            <div className="compile-results-container">
                <h1>Compile Results</h1>
                <input 
                type="number"
                id="election-id"
                onChange={(e) =>(setElectionId(e.target.value))}
                value={electionId}
                placeholder="enter election id"
                />
                <label htmlFor="election-id">Election ID</label>
                <button
                onClick={compileResults}
                >
                    Compile Results
                </button>
            </div>

            <div className="view-result-container">
                <h1>View Results</h1>
                <input 
                type="number"
                onChange={(e) =>(setElectionId(e.target.value))}
                value={electionId}
                placeholder="enter election id"
                />
                <button
                onClick={viewResult}
                >
                    View Result
                </button>
            </div>
        </div>
    )

}   
