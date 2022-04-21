import { expect } from "chai";
import { ethers } from "hardhat";
import MockData from "./__mocks__";
import { Signer, Contract } from "ethers";
import { StakeholderType } from "./constants/stakeholder-type.const";

describe("DEPLOYMENT TESTS", function () {

  let accounts: Signer[];
  let zuriVotingContract: Contract;

  before(async function () {
    accounts = await ethers.getSigners();

    const ZuriSchoolVoting = await ethers.getContractFactory("ZuriSchoolVoting");
    zuriVotingContract = await ZuriSchoolVoting.deploy("ZuriSchool");

    await zuriVotingContract.deployed();
  });

  it("Check initial state on deployment of contract", async function () {
    expect(await zuriVotingContract.schoolName()).to.equal("ZuriSchool");
    expect(await zuriVotingContract.electionCount()).to.equal(0);
  });

  it("Check that chairperson (voter) exists with valid data on deployment of contract", async function () {
    const CHAIRPERSON_VOTER = await zuriVotingContract.voters(accounts[0].getAddress());
    
    expect(CHAIRPERSON_VOTER[0]).to.equal("chairperson");
    expect(CHAIRPERSON_VOTER[1]).to.equal(true);
    expect(CHAIRPERSON_VOTER[2]).to.equal(StakeholderType.DIRECTOR);
  });

  it("Check that stakeholder vote weights are all equal 1 on deployment of contract", async function () {
    const TEACHER_WEIGHT = await zuriVotingContract.getWeight("teacher");
    const STUDENT_WEIGHT = await zuriVotingContract.getWeight("student");
    const DIRECTOR_WEIGHT = await zuriVotingContract.getWeight("director");
    
    expect(TEACHER_WEIGHT).to.equal(1);
    expect(STUDENT_WEIGHT).to.equal(1);
    expect(DIRECTOR_WEIGHT).to.equal(1);
  });

  it("Check that 'iamChairperson' functions returns true when chair-person address is passed", async function () {
    const IS_CHAIR_PERSON = await zuriVotingContract.iamChairperson(accounts[0].getAddress());

    expect(IS_CHAIR_PERSON).to.equal(true);
  });

  it("Check that 'iamChairperson' functions returns false when address passed is not for chair-person", async function () {
    const IS_CHAIR_PERSON = await zuriVotingContract.iamChairperson(MockData.UNEXIST_WALLET_ADDRESS);

    expect(IS_CHAIR_PERSON).to.equal(false);
  });

});