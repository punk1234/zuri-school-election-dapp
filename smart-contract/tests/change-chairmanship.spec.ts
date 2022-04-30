import { expect } from "chai";
import { ethers } from "hardhat";
import MockData from "./__mocks__";
import TestHelper from "./helpers";
import { Signer, Contract } from "ethers";
import { StakeholderType } from "./constants/stakeholder-type.const";

describe("DEPLOYMENT TESTS", function () {

  let accounts: Signer[];
  let zuriVotingContract: Contract;

  before(async function () {
    accounts = await ethers.getSigners();
    zuriVotingContract = await TestHelper.deployContract();
  });

  it("Check non-chairman user cannot changeChairmanship", async function () {
    await expect(zuriVotingContract.connect(accounts[1]).changeChairmanship(MockData.UNEXIST_WALLET_ADDRESS))
      .to.be.revertedWith("only chairperson can perform this operation");
  });

  it("Check chairman can changeChairmanship", async function () {
    await zuriVotingContract.changeChairmanship(MockData.UNEXIST_WALLET_ADDRESS);
    
    expect(await zuriVotingContract.chairperson())
      .equals(MockData.UNEXIST_WALLET_ADDRESS);
  });

});