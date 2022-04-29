import { expect } from "chai";
import { ethers } from "hardhat";
import MockData from "./__mocks__";
import TestHelper from "./helpers";
import { Signer, Contract } from "ethers";
import { StakeholderType } from "./constants/stakeholder-type.const";

describe("STAKE-HOLDERS TESTS", function () {

  let accounts: Signer[];
  let zuriVotingContract: Contract;

  before(async function () {
    accounts = await ethers.getSigners();
    zuriVotingContract = await TestHelper.deployContract();
  });

  describe("addStudent TESTS", async () => {

    it("Check that student to be added with empty name should throw error", async function () {
        await expect(zuriVotingContract.addStudent("", MockData.UNEXIST_WALLET_ADDRESS))
          .to.be.revertedWith("student name is not valid");
    });

    it("Check that student can be added successfully without any error", async function () {
        await expect(zuriVotingContract.addStudent("Student 1", MockData.UNEXIST_WALLET_ADDRESS))
            .to.emit(zuriVotingContract, "StudentCreated");

        const STUDENT_VOTER = await zuriVotingContract.voters(MockData.UNEXIST_WALLET_ADDRESS);

        expect(STUDENT_VOTER[0]).to.equal("Student 1");
        expect(STUDENT_VOTER[1]).to.equal(true);
        expect(STUDENT_VOTER[2]).to.equal(StakeholderType.STUDENT);
    });

    it("Check that student that has already been added cannot be added again (using address as ID)", async function () {
        await expect(zuriVotingContract.addStudent("Student 1", MockData.UNEXIST_WALLET_ADDRESS))
          .to.be.revertedWith("student already exist");
    });

  });

  describe("addTeacher TESTS", async () => {

    it("Check that teacher to be added with empty name should throw error", async function () {
        await expect(zuriVotingContract.addTeacher("", MockData.UNEXIST_WALLET_ADDRESS))
          .to.be.revertedWith("teacher name is not valid");
    });

    it("Check that teacher can be added successfully without any error", async function () {
        await expect(zuriVotingContract.addTeacher("Teacher 1", MockData.UNEXIST_WALLET_ADDRESS_2))
            .to.emit(zuriVotingContract, "TeacherCreated");

        const TEACHER_VOTER = await zuriVotingContract.voters(MockData.UNEXIST_WALLET_ADDRESS_2);

        expect(TEACHER_VOTER[0]).to.equal("Teacher 1");
        expect(TEACHER_VOTER[1]).to.equal(true);
        expect(TEACHER_VOTER[2]).to.equal(StakeholderType.TEACHER);
    });

    it("Check that teacher that has already been added cannot be added again (using address as ID)", async function () {
        await expect(zuriVotingContract.addTeacher("Teacher 1", MockData.UNEXIST_WALLET_ADDRESS))
          .to.be.revertedWith("teacher already exist");
    });

  });

  describe("addDirector TESTS", async () => {

    it("Check that director to be added with empty name should throw error", async function () {
        await expect(zuriVotingContract.addDirector("", MockData.UNEXIST_WALLET_ADDRESS))
          .to.be.revertedWith("director name is not valid");
    });

    it("Check that director can be added successfully without any error", async function () {
        await expect(zuriVotingContract.addDirector("Director 1", MockData.UNEXIST_WALLET_ADDRESS_3))
            .to.emit(zuriVotingContract, "DirectorCreated");

        const DIRECTOR_VOTER = await zuriVotingContract.voters(MockData.UNEXIST_WALLET_ADDRESS_3);

        expect(DIRECTOR_VOTER[0]).to.equal("Director 1");
        expect(DIRECTOR_VOTER[1]).to.equal(true);
        expect(DIRECTOR_VOTER[2]).to.equal(StakeholderType.DIRECTOR);
    });

    it("Check that teacher that has already been added cannot be added again (using address as ID)", async function () {
      await expect(zuriVotingContract.addDirector("Director 1", MockData.UNEXIST_WALLET_ADDRESS))
        .to.be.revertedWith("director already exist");
    });

  });

});