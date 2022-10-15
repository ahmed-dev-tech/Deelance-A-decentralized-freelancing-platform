require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");
require("dotenv").config();

const polygonFork = process.env.POLY_FORK;
const ethFork = process.env.ETH_FORK;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      forking: {
        url: polygonFork,
        blockNumber: 34290177,
      },
      chainId: 1337, // We set 1337 to make interacting with MetaMask simpler
    },
    development: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
  },
};
