import { expect } from "chai";
import { ethers } from "hardhat";
import MockData from "./__mocks__";
import { Signer, Contract } from "ethers";
import { StakeholderType } from "./constants/stakeholder-type.const";

describe("ELECTION TESTS", function () {

  let accounts: Signer[];
  let zuriVotingContract: Contract;

  before(async function () {
    accounts = await ethers.getSigners();

    const ZuriSchoolVoting = await ethers.getContractFactory("ZuriSchoolVoting");
    zuriVotingContract = await ZuriSchoolVoting.deploy("ZuriSchool");

    await zuriVotingContract.deployed();
  });

  describe("createElection TESTS", async () => {

    it("Check that election gets created with valid data & emits BallotCreated event", async function () {
        await expect(
            zuriVotingContract.createElection(
                "election 001",
                3, // no. of candidates allowed
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

    it("Check that createElection throws error when no candidates & lists does not match", async function () {
        await expect(
            zuriVotingContract.createElection(
                "election 001",
                3, // no. of candidates allowed
                "election 001 description goes here ...",
                [],
                1
            )
        ).to.be.revertedWith("number of proposals must equal number of choices");
    });

    it("Check that createElection throws error when only 1 candidate is provided", async function () {
        await expect(
            zuriVotingContract.createElection(
                "election 001",
                1, // no. of candidates allowed
                "election 001 description goes here ...",
                [ "Candidate 1" ],
                1
            )
        ).to.be.revertedWith("must have more than one choice to create election");
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
            .to.be.revertedWith("already stopped election cannot be stopped again");
    });

  });

});