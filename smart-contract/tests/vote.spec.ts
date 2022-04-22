import { expect } from "chai";
import { ethers } from "hardhat";
import MockData from "./__mocks__";
import { Signer, Contract } from "ethers";

describe("VOTE TESTS", function () {

  let accounts: Signer[];
  let zuriVotingContract: Contract;

  before(async function () {
    accounts = await ethers.getSigners();

    const ZuriSchoolVoting = await ethers.getContractFactory("ZuriSchoolVoting");
    zuriVotingContract = await ZuriSchoolVoting.deploy("ZuriSchool");

    await zuriVotingContract.deployed();

    await expect(
        zuriVotingContract
          .createElection("election 1", 2, "desc goes here ...", ["Candidate 1", "Candidate 2"], 1)
    ).to.emit(zuriVotingContract, "BallotCreated");
  });

  describe("castVote TESTS", async () => {

    it("Check that election vote casting throws error when election is not started", async function () {
        await expect(zuriVotingContract.castVote(0, 0))
            .to.be.revertedWith("election must be active to cast a vote");
    });

    it("Check that election vote is casted with valid data & emits VoteCasted event", async function () {
        await zuriVotingContract.startElection(0);
        
        await expect(zuriVotingContract.castVote(0, 0))
            .to.emit(zuriVotingContract, "VoteCasted");
    });

    it("Check that election vote casting throws error after user alrrady voted", async function () {
        await expect(zuriVotingContract.castVote(0, 0))
            .to.be.revertedWith("you have already voted for this election");
    });

  });

  describe("setWeight TESTS", async () => {

    it("Check that error is thrown when trying to set vote weight for stakeholder type that does not exist", async function () {
        await expect(zuriVotingContract.setWeight("UNKNOWN-STAKEHOLDER-TYPE", 5))
            .to.be.revertedWith("invalid stakeholder name entered");
    });

    it("Check that error is thrown when trying to set stakeholder vote weight with out-of-bounds value", async function () {
        await expect(zuriVotingContract.setWeight("teacher", 12))
            .to.be.revertedWith("weights can only take values 1 to 10");
    });

    it("Check that setting vote weight for stakeholder type with valid inputs gives no error", async function () {
        await zuriVotingContract.setWeight("student", 3);

        expect(await zuriVotingContract.getWeight("student")).to.equal(3);
    });

  });

  describe("getWeight TESTS", async () => {

    it("Check that error is thrown when trying to get vote weight for stakeholder type that does not exist", async function () {
        await expect(zuriVotingContract.getWeight("UNKNOWN-STAKEHOLDER-TYPE"))
            .to.be.revertedWith("invalid stakeholder name entered");
    });

  });

});
