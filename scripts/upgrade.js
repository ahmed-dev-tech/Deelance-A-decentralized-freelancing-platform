const path = require("path");
const { ethers, upgrades } = require("hardhat");
const deployedAddress = require("../client/abi/Deelance-address.json");

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
const upgrade = async () => {
  const Deelance = await ethers.getContractFactory("Deelance");
  const deelance = await upgrades.upgradeProxy(
    deployedAddress.Deelance,
    Deelance
  );
  await deelance.deployed();
  console.log("Deelance address:", deelance.address);
  saveFrontendFiles(deelance, "Deelance");
};
upgrade();
