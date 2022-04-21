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

});