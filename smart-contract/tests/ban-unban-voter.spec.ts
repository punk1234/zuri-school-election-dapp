import { expect } from "chai";
import { ethers } from "hardhat";
import MockData from "./__mocks__";
import { Signer, Contract } from "ethers";
import { StakeholderType } from "./constants/stakeholder-type.const";
import TestHelper from "./helpers";

describe("BAN-UNBAN VOTERS TESTS", function () {

  let accounts: Signer[];
  let zuriVotingContract: Contract;

  before(async function () {
    accounts = await ethers.getSigners();
    zuriVotingContract = await TestHelper.deployContract();
  });

  describe("banVoter TESTS", async () => {

    it("Check that newly added student with voting right can be banned", async function () {
        await expect(zuriVotingContract.addStudent("Student 1", MockData.UNEXIST_WALLET_ADDRESS))
            .to.emit(zuriVotingContract, "StudentCreated");

        let STUDENT_VOTER = await zuriVotingContract.voters(MockData.UNEXIST_WALLET_ADDRESS);

        expect(STUDENT_VOTER[0]).to.equal("Student 1");
        expect(STUDENT_VOTER[1]).to.equal(true);
        expect(STUDENT_VOTER[2]).to.equal(StakeholderType.STUDENT);

        await expect(zuriVotingContract.banVoter(MockData.UNEXIST_WALLET_ADDRESS))
            .to.emit(zuriVotingContract, "BanVoter");

        STUDENT_VOTER = await zuriVotingContract.voters(MockData.UNEXIST_WALLET_ADDRESS);

        expect(STUDENT_VOTER[1]).to.equal(false);
    });

    it("Check that banning a student that has already been banned will throw an error", async function () {
        await expect(zuriVotingContract.banVoter(MockData.UNEXIST_WALLET_ADDRESS))
          .to.be.revertedWith("user has already been banned");
    });

  });

  describe("unbanVoter TESTS", async () => {

    it("Check that newly added teacher with voting right cannot be unbanned", async function () {
        await expect(zuriVotingContract.addTeacher("Teacher 1", MockData.UNEXIST_WALLET_ADDRESS_2))
            .to.emit(zuriVotingContract, "TeacherCreated");

        let TEACHER_VOTER = await zuriVotingContract.voters(MockData.UNEXIST_WALLET_ADDRESS_2);

        expect(TEACHER_VOTER[0]).to.equal("Teacher 1");
        expect(TEACHER_VOTER[1]).to.equal(true);
        expect(TEACHER_VOTER[2]).to.equal(StakeholderType.TEACHER);

        await expect(zuriVotingContract.unbanVoter(MockData.UNEXIST_WALLET_ADDRESS_2))
            .to.be.revertedWith("user is not banned");
    });

    it("Check that banned teacher can be unbanned without error", async function () {
        await expect(zuriVotingContract.unbanVoter(MockData.UNEXIST_WALLET_ADDRESS))
            .to.emit(zuriVotingContract, "UnbanVoter");

        const STUDENT_VOTER = await zuriVotingContract.voters(MockData.UNEXIST_WALLET_ADDRESS);

        expect(STUDENT_VOTER[1]).to.equal(true);
    });

  });

});