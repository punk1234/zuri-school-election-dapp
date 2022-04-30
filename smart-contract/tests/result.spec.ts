import { expect } from "chai";
import { ethers } from "hardhat";
import MockData from "./__mocks__";
import TestHelper from "./helpers";
import { Signer, Contract } from "ethers";

describe("VOTE RESULTS TESTS", function () {

  let accounts: Signer[];
  let zuriVotingContract: Contract;

  before(async function () {
    accounts = await ethers.getSigners();
    zuriVotingContract = await TestHelper.deployContract();

    await expect(
        zuriVotingContract
          .createElection("election 1", "desc goes here ...", ["Candidate 1", "Candidate 2"], 1)
    ).to.emit(zuriVotingContract, "BallotCreated");
  });

  describe("viewElectionStats TESTS", async () => {

    it("Check that viewElectionStats for election without any casted vote does not throw error", async function () {
        const [ names, , , ] = await zuriVotingContract.viewElectionStats(0);

        expect(names.length).to.equal(1); // only chairperson is a voter by default
    });

  });

  describe("compileResults TESTS", async () => {

    it("Check that compileResults for election without any casted vote does not throw error", async function () {
        await zuriVotingContract.startElection(0);

        await expect(await zuriVotingContract.compileResults(0))
            .to.emit(zuriVotingContract, "BallotResultCompiled");
    });

  });

  describe("viewResult TESTS", async () => {

    it("Check that viewResult for election without any casted vote does not throw error", async function () {
        const ELECTION_RESULT = await zuriVotingContract.viewResult(0);

        expect(ELECTION_RESULT[0]).to.equal("election 1");
        expect(ELECTION_RESULT[1]).to.equal("Candidate 1");
        expect(ELECTION_RESULT[2]).to.equal(0);
    });

  });

});