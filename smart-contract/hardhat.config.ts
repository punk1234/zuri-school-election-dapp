import "solidity-coverage";
import dotenv from "dotenv";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ganache";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
    solidity: {
        version: "0.8.7", 
    },
    defaultNetwork: "mumbai",
    networks: {
        hardhat: {},
        mumbai: {
            url: API_URL,
            accounts: [`${PRIVATE_KEY}`]
        }
    },
    mocha: { timeout: 80000 }
};