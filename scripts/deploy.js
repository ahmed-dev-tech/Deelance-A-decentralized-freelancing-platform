// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");
const { ethers, upgrades } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Deelance = await ethers.getContractFactory("Deelance");
  const deelance = await upgrades.deployProxy(
    Deelance,
    ["0x770E31C2Ba68cfb6ECe29CfF2BEA87F895ffDa7A", 2],
    { initializer: "construct" }
  );
  // const deelance = await Deelance.deploy();
  await deelance.deployed();

  console.log("Deelance address:", deelance.address);
  await fundMyAccounts();
  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(deelance, "Deelance");
}

function saveFrontendFiles(token, name) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "client", "abi");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, `${name}-address.json`),
    JSON.stringify({ [name]: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    path.join(contractsDir, `${name}.json`),
    JSON.stringify(TokenArtifact, null, 2)
  );
}
async function fundMyAccounts() {
  try {
    const IERC20_SOURCE =
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";
    const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    let accounts, impersonatedSigner1, usdcContract;
    accounts = await ethers.getSigners();
    await helpers.impersonateAccount(
      "0x6E685A45Db4d97BA160FA067cB81b40Dfed47245"
    );
    impersonatedSigner1 = await ethers.getSigner(
      "0x6E685A45Db4d97BA160FA067cB81b40Dfed47245"
    );
    usdcContract = await ethers.getContractAt(
      IERC20_SOURCE,
      USDC,
      impersonatedSigner1
    );
    await usdcContract
      .connect(impersonatedSigner1)
      .transfer(accounts[0].address, 500);
    await usdcContract
      .connect(impersonatedSigner1)
      .transfer(accounts[1].address, 500);
    await usdcContract
      .connect(impersonatedSigner1)
      .transfer(accounts[2].address, 500);
    await usdcContract
      .connect(impersonatedSigner1)
      .transfer(accounts[3].address, 500);
    await usdcContract
      .connect(impersonatedSigner1)
      .transfer(accounts[4].address, 500);
    await usdcContract
      .connect(impersonatedSigner1)
      .transfer(accounts[5].address, 500);
    await usdcContract
      .connect(impersonatedSigner1)
      .transfer(accounts[6].address, 500);
    await usdcContract
      .connect(impersonatedSigner1)
      .transfer(accounts[7].address, 500);
  } catch (error) {
    throw error;
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
