import { expect } from "chai";
import { ethers } from "hardhat";
import MockData from "./__mocks__";
import TestHelper from "./helpers";
import { Signer, Contract } from "ethers";

describe("ELECTION TESTS", function () {

  let accounts: Signer[];
  let zuriVotingContract: Contract;

  before(async function () {
    accounts = await ethers.getSigners();
    zuriVotingContract = await TestHelper.deployContract();
  });

  describe("createElection TESTS", async () => {

    it("Check that election gets created with valid data & emits BallotCreated event", async function () {
        await expect(
            zuriVotingContract.createElection(
                "election 001",
                "election 001 description goes here ...",
                [ "Candidate 1", "Candidate 2", "Candidate 3" ],
                1
            )
        ).to.emit(zuriVotingContract, "BallotCreated");
    
        const [ name, proposals, active, computed ] = await zuriVotingContract.viewElection(0);
        
        expect(name).to.equal("election 001");
        expect(proposals.length).to.equal(3);
    
        expect(proposals[0]).to.equal("Candidate 1");
        expect(proposals[1]).to.equal("Candidate 2");
        expect(proposals[2]).to.equal("Candidate 3");
        
        expect(active).to.equal(false);
        expect(computed).to.equal(false);
    });

    it("Check that createElection throws error when only 1 candidate is provided", async function () {
        await expect(
            zuriVotingContract.createElection(
                "election 001",
                "election 001 description goes here ...",
                [ "Candidate 1" ],
                1
            )
        ).to.be.revertedWith("choice must be atleast 2");
    });

  });

  describe("startElection TESTS", async () => {

    it("Check that election has not been started gets started & emits BallotCreated event", async function () {
        await expect(zuriVotingContract.startElection(0))
            .to.emit(zuriVotingContract, "BallotStarted");
    
        const [ , , active, ] = await zuriVotingContract.viewElection(0);

        expect(active).to.equal(true);
    });

    it("Check that election has been started throws error on startElection", async function () {
        await expect(zuriVotingContract.startElection(0))
            .to.be.revertedWith("already started election cannot be started again");
    });

  });

  describe("stopElection TESTS", async () => {

    it("Check that election that has been started gets stopped & emits BallotStopped event", async function () {
        await expect(zuriVotingContract.stopElection(0))
            .to.emit(zuriVotingContract, "BallotStopped");
    
        const [ , , active, ] = await zuriVotingContract.viewElection(0);

        expect(active).to.equal(false);
    });

    it("Check that election that has been stopped throws error on stopElection", async function () {
        await expect(zuriVotingContract.stopElection(0))
            .to.be.revertedWith("election has not started");
    });

  });

});