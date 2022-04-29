import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

/**
 * @class TestHelper
 */
class TestHelper {

    /**
     * @method deployContract
     * @description This method deploys the voting smart-contract
     * @static
     * @async
     * @returns {Promise<Contract>}
     */
    static async deployContract(): Promise<Contract> {
        const ZuriSchoolVoting: ContractFactory = await ethers.getContractFactory(
            "ZuriSchoolVoting"
        );

        const zuriVotingContract: Contract = await ZuriSchoolVoting.deploy(
            "ZuriSchool",
            (await ethers.getSigners())[0].getAddress()
        );

        await zuriVotingContract.deployed();
        return zuriVotingContract;
    }

}

export default TestHelper;