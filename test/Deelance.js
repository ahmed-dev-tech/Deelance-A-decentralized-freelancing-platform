const { expect, assert } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";

const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
describe("Deelance contract", function () {
  let deelance, accounts, impersonatedSigner1, usdcContract;

  before(async () => {
    accounts = await ethers.getSigners();
    const DeelanceContract = await ethers.getContractFactory("Deelance");
    deelance = await upgrades.deployProxy(
      DeelanceContract,
      ["0x770E31C2Ba68cfb6ECe29CfF2BEA87F895ffDa7A", 2],
      { initializer: "construct" }
    );
    await deelance.deployed();
    await helpers.impersonateAccount(
      "0x6E685A45Db4d97BA160FA067cB81b40Dfed47245"
    );
    // to supply us USDC
    impersonatedSigner1 = await ethers.getSigner(
      "0x6E685A45Db4d97BA160FA067cB81b40Dfed47245"
    );
    usdcContract = await ethers.getContractAt(
      IERC20_SOURCE,
      USDC,
      impersonatedSigner1
    );
  });
  describe("Vault Functions", () => {
    describe("Register Client", async function () {
      it("should register client successfully", async () => {
        await deelance.registerClient({ from: accounts[0].address });
        const usersId = await deelance.usersId();
        expect(usersId.toString()).to.equal("1");
      });
      it("should reject", async () => {
        await expect(
          deelance.registerClient({ from: accounts[0].address })
        ).to.be.rejectedWith("This address is registered as a client");
      });
      it("should also register client successfully", async () => {
        await deelance.connect(accounts[1]).registerClient();
        const usersId = await deelance.usersId();
        expect(usersId.toString()).to.equal("2");
      });
    });

    describe("Register Freelancer", async function () {
      it("should register freelancer successfully", async () => {
        await deelance.connect(accounts[2]).registerFreelancer();
        const usersId = await deelance.usersId();
        expect(usersId.toString()).to.equal("3");
      });
      it("should reject", async () => {
        await expect(
          deelance.connect(accounts[2]).registerFreelancer()
        ).to.be.rejectedWith("This address is registered as a freelancer");
      });
      it("should also register freelancer successfully", async () => {
        await deelance.connect(accounts[3]).registerFreelancer();
        const usersId = await deelance.usersId();
        expect(usersId.toString()).to.equal("4");
      });
      it("should register a client as a freelancer", async () => {
        await deelance.connect(accounts[1]).registerFreelancer();
        const usersId = await deelance.usersId();
        expect(usersId.toString()).to.equal("4");
      });
    });

    describe("Fund  with native token ", async function () {
      it("should fund vault with 5 matic", async () => {
        let ethValue = ethers.utils.parseEther("5.0");
        await accounts[1].sendTransaction({
          to: deelance.address,
          value: ethValue,
        });
        const ethInVault = await deelance.getEthInVault(accounts[1].address);
        assert.equal(ethInVault.toString(), ethValue);
      });
    });
    describe("Fund with ERC20 token", async function () {
      before(async () => {
        await usdcContract
          .connect(impersonatedSigner1)
          .transfer(accounts[0].address, 50);
        await usdcContract
          .connect(impersonatedSigner1)
          .transfer(accounts[1].address, 50);
        await usdcContract
          .connect(impersonatedSigner1)
          .transfer(accounts[2].address, 50);
      });
      it("should fund vault with USDC", async () => {
        await usdcContract.connect(accounts[0]).approve(deelance.address, 25);
        await usdcContract.connect(accounts[1]).approve(deelance.address, 25);
        await deelance.connect(accounts[0]).fundWithERC20(25, USDC);
        await deelance.connect(accounts[1]).fundWithERC20(20, USDC);
        const usdcAmount = await deelance.getERC20InVault(
          accounts[0].address,
          USDC
        );
        assert.equal(usdcAmount.toString(), "25");
        const usdcAmount1 = await deelance.getERC20InVault(
          accounts[1].address,
          USDC
        );
        assert.equal(usdcAmount1.toString(), "20");
      });
    });
  });
  describe("Deelance Functions", () => {
    describe("Start Project", async () => {
      it("Should successfully start a project", async () => {
        const projectsId = await deelance.projectsId();
        await deelance
          .connect(accounts[0])
          .startProject(
            ethers.utils.formatBytes32String(1),
            accounts[2].address
          );
        console.log(projectsId.toString());
        assert.equal(projectsId.toString(), "1");
        const project = await deelance.projects(parseInt(projectsId));
        console.log(project.client);
        // assert.equal(project.client, accounts[0].address);
      });
      it("Should not start project with himself", async () => {
        await expect(
          deelance.connect(accounts[1]).startProject(accounts[1].address)
        ).to.be.rejectedWith("You cannot work for yourself");
        const projectsId = await deelance.projectsId();
        assert.equal(projectsId.toString(), "1");
      });
      it("Should start a project as unregistered client", async () => {
        await deelance.connect(accounts[5]).startProject(accounts[3].address);
        const projectsId = await deelance.projectsId();
        assert.equal(projectsId.toString(), "2");
        const project = await deelance.projects(parseInt(projectsId));
        assert.equal(project.client, accounts[5].address);
        const usersId = await deelance.usersId();
        assert.equal(usersId.toString(), "5");
        const isClient = await deelance.users(accounts[5].address);
        assert.equal(isClient.isClient, true);
        assert.equal(isClient.isFreelancer, false);
      });
      it("Should not start project with unregistered freelancer", async () => {
        await expect(
          deelance.connect(accounts[1]).startProject(accounts[0].address)
        ).to.be.rejectedWith("This freelancer does not exist");
        const projectsId = await deelance.projectsId();
        assert.equal(projectsId.toString(), "2");
      });
      it("Should also start a project with another client address", async () => {
        await deelance.connect(accounts[1]).startProject(accounts[3].address);
        const projectsId = await deelance.projectsId();
        assert.equal(projectsId.toString(), "3");
        const project = await deelance.projects(parseInt(projectsId));
        assert.equal(project.client, accounts[1].address);
      });
    });
    describe("Join Project", async () => {
      it("should join project successfully", async () => {
        let project = await deelance.projects(1);
        assert.equal(project.approved, false);
        await deelance.connect(accounts[2]).joinProject(1);
        project = await deelance.projects(1);
        assert.equal(project.approved, true);
      });
      it("should not join project as unregistered freelancer", async () => {
        let project = await deelance.projects(2);
        assert.equal(project.approved, false);
        await expect(
          deelance.connect(accounts[0]).joinProject(2)
        ).to.be.rejectedWith("You are not registered as a freelancer");
        project = await deelance.projects(2);
        assert.equal(project.approved, false);
      });
      it("should not join project as wrong freelancer", async () => {
        let project = await deelance.projects(2);
        assert.equal(project.approved, false);
        await expect(
          deelance.connect(accounts[2]).joinProject(2)
        ).to.be.rejectedWith("You are not the freelancer for this project");
        project = await deelance.projects(2);
        assert.equal(project.approved, false);
      });
    });
    describe("Add Milestone", async () => {
      it("should successfully add milestone with matic", async () => {
        let ethInVault, ethOutOfVault;
        await accounts[0].sendTransaction({
          to: deelance.address,
          value: ethers.utils.parseEther("5"),
        });
        ethInVault = await deelance.getEthInVault(accounts[0].address);
        ethOutOfVault = await deelance.getEthOutOfVault(accounts[0].address);
        assert.equal(ethInVault.toString(), ethers.utils.parseEther("5"));
        assert.equal(ethOutOfVault.toString(), 0);
        await deelance
          .connect(accounts[0])
          .addMilestone(
            1,
            Date.now(),
            false,
            accounts[0].address,
            0,
            ethers.utils.parseEther("5")
          );
        ethInVault = await deelance.getEthInVault(accounts[0].address);
        ethOutOfVault = await deelance.getEthOutOfVault(accounts[0].address);
        assert.equal(ethInVault.toString(), 0);
        assert.equal(ethOutOfVault.toString(), ethers.utils.parseEther("5"));
      });
      it("should not add milestone not the owner", async () => {
        let ethInVault, ethOutOfVault;
        await accounts[1].sendTransaction({
          to: deelance.address,
          value: ethers.utils.parseEther("5"),
        });
        ethInVault = await deelance.getEthInVault(accounts[1].address);
        ethOutOfVault = await deelance.getEthOutOfVault(accounts[1].address);
        assert.equal(ethInVault.toString(), ethers.utils.parseEther("10"));
        assert.equal(ethOutOfVault.toString(), 0);
        await expect(
          deelance
            .connect(accounts[1])
            .addMilestone(
              1,
              Date.now(),
              false,
              accounts[1].address,
              0,
              ethers.utils.parseEther("5")
            )
        ).to.be.rejectedWith("You are not the owner of this project");
        ethInVault = await deelance.getEthInVault(accounts[1].address);
        ethOutOfVault = await deelance.getEthOutOfVault(accounts[1].address);
        assert.equal(ethInVault.toString(), ethers.utils.parseEther("10"));
        assert.equal(ethOutOfVault.toString(), 0);
      });
      it("should not add milestone not enough matic in vault", async () => {
        let ethInVault, ethOutOfVault;
        await accounts[0].sendTransaction({
          to: deelance.address,
          value: ethers.utils.parseEther("5"),
        });
        ethInVault = await deelance.getEthInVault(accounts[0].address);
        ethOutOfVault = await deelance.getEthOutOfVault(accounts[0].address);
        assert.equal(ethInVault.toString(), ethers.utils.parseEther("5"));
        assert.equal(ethOutOfVault.toString(), ethers.utils.parseEther("5"));
        await expect(
          deelance
            .connect(accounts[0])
            .addMilestone(
              1,
              Date.now(),
              false,
              accounts[0].address,
              0,
              ethers.utils.parseEther("6")
            )
        ).to.be.rejectedWith("not enough eth in vault");
        ethInVault = await deelance.getEthInVault(accounts[0].address);
        ethOutOfVault = await deelance.getEthOutOfVault(accounts[0].address);
        assert.equal(ethInVault.toString(), ethers.utils.parseEther("5"));
        assert.equal(ethOutOfVault.toString(), ethers.utils.parseEther("5"));
      });
      it("should add milestone with erc20 token", async () => {
        let erc20InVault, erc20OutOfVault;
        erc20InVault = await deelance.getERC20InVault(
          accounts[0].address,
          USDC
        );
        erc20OutOfVault = await deelance.getERC20OutOfVault(
          accounts[0].address,
          USDC
        );
        assert.equal(erc20InVault.toString(), "25");
        assert.equal(erc20OutOfVault.toString(), "0");
        await deelance
          .connect(accounts[0])
          .addMilestone(1, Date.now(), true, USDC, 20, 0);
        erc20InVault = await deelance.getERC20InVault(
          accounts[0].address,
          USDC
        );
        erc20OutOfVault = await deelance.getERC20OutOfVault(
          accounts[0].address,
          USDC
        );
        assert.equal(erc20InVault.toString(), "5");
        assert.equal(erc20OutOfVault.toString(), "20");
      });
      it("should not add milestone not enough erc20 in vault", async () => {
        let erc20InVault, erc20OutOfVault;
        erc20InVault = await deelance.getERC20InVault(
          accounts[1].address,
          USDC
        );
        erc20OutOfVault = await deelance.getERC20OutOfVault(
          accounts[1].address,
          USDC
        );
        assert.equal(erc20InVault.toString(), "20");
        assert.equal(erc20OutOfVault.toString(), "0");
        await expect(
          deelance
            .connect(accounts[1])
            .addMilestone(3, Date.now(), true, USDC, 25, 0)
        ).to.be.rejectedWith("not enough erc20 token in vault");
        erc20InVault = await deelance.getERC20InVault(
          accounts[1].address,
          USDC
        );
        erc20OutOfVault = await deelance.getERC20OutOfVault(
          accounts[1].address,
          USDC
        );
        assert.equal(erc20InVault.toString(), "20");
        assert.equal(erc20OutOfVault.toString(), "0");
      });
      it("should add milestone to project 3", async () => {
        let ethInVault, ethOutOfVault;
        await accounts[1].sendTransaction({
          to: deelance.address,
          value: ethers.utils.parseEther("5"),
        });
        ethInVault = await deelance.getEthInVault(accounts[1].address);
        ethOutOfVault = await deelance.getEthOutOfVault(accounts[1].address);
        assert.equal(ethInVault.toString(), ethers.utils.parseEther("15"));
        assert.equal(ethOutOfVault.toString(), 0);
        await deelance
          .connect(accounts[1])
          .addMilestone(
            3,
            Date.now(),
            false,
            accounts[0].address,
            0,
            ethers.utils.parseEther("10")
          );
        ethInVault = await deelance.getEthInVault(accounts[1].address);
        ethOutOfVault = await deelance.getEthOutOfVault(accounts[1].address);
        assert.equal(ethInVault.toString(), ethers.utils.parseEther("5"));
        assert.equal(ethOutOfVault.toString(), ethers.utils.parseEther("10"));
      });
    });
    describe("Milestone Completed", async () => {
      it("should mark milestone as completed", async () => {
        let milestones = await deelance.getMilestones(1);
        let initialEthOutOfVault = await deelance.getEthOutOfVault(
          accounts[0].address
        );
        let initialFreelancerBalance = await accounts[2].getBalance();
        assert.equal(milestones[0].completed, false);
        await deelance.connect(accounts[0]).milestoneCompleted(1, 0);
        milestones = await deelance.getMilestones(1);
        let finalEthOutOfVault = await deelance.getEthOutOfVault(
          accounts[0].address
        );
        let finalFreelancerBalance = await accounts[2].getBalance();
        assert.equal(milestones[0].completed, true);
        assert.equal(milestones[1].completed, false);
        assert(
          initialEthOutOfVault - finalEthOutOfVault - milestones[0].payment <
            10 ** 10,
          "wrong"
        );
        assert(
          finalFreelancerBalance -
            initialFreelancerBalance -
            milestones[0].payment <
            10 ** 10,
          "wrong"
        );
      });
      it("should reject not owner of project", async () => {
        let milestones = await deelance.getMilestones(3);
        let initialEthOutOfVault = await deelance.getEthOutOfVault(
          accounts[0].address
        );
        let initialFreelancerBalance = await accounts[3].getBalance();
        assert.equal(milestones[0].completed, false);
        await expect(
          deelance.connect(accounts[0]).milestoneCompleted(3, 0)
        ).to.be.rejectedWith("Only the project owner can call this function");
        milestones = await deelance.getMilestones(3);
        let finalEthOutOfVault = await deelance.getEthOutOfVault(
          accounts[0].address
        );
        let finalFreelancerBalance = await accounts[3].getBalance();
        assert.equal(milestones[0].completed, false);
        assert.equal(initialEthOutOfVault - finalEthOutOfVault, 0);
        assert.equal(finalFreelancerBalance - initialFreelancerBalance, 0);
      });
      it("should reject milestone already completed", async () => {
        let milestones = await deelance.getMilestones(1);
        assert.equal(milestones[0].completed, true);
        await expect(
          deelance.connect(accounts[0]).milestoneCompleted(1, 0)
        ).to.be.rejectedWith("This milestone has been marked as completed");
        milestones = await deelance.getMilestones(1);
        assert.equal(milestones[0].completed, true);
        assert.equal(milestones[1].completed, false);
      });
      it("should reject milestone does not exist", async () => {
        let milestones = await deelance.getMilestones(1);
        assert.equal(milestones[0].completed, true);
        await expect(
          deelance.connect(accounts[0]).milestoneCompleted(1, 2)
        ).to.be.rejectedWith("This milestone does not exist");
        milestones = await deelance.getMilestones(1);
        assert.equal(milestones[0].completed, true);
        assert.equal(milestones[1].completed, false);
      });
      it("should mark second milestone as completed", async () => {
        let milestones = await deelance.getMilestones(1);
        let initialERC20OutOfVault = await deelance.getERC20OutOfVault(
          accounts[0].address,
          USDC
        );
        let initialFreelancerBalance = await usdcContract.balanceOf(
          accounts[2].address
        );
        assert.equal(milestones[0].completed, true);
        assert.equal(milestones[1].completed, false);
        await deelance.connect(accounts[0]).milestoneCompleted(1, 1);
        milestones = await deelance.getMilestones(1);
        let finalERC20OutOfVault = await deelance.getERC20OutOfVault(
          accounts[0].address,
          USDC
        );
        let finalFreelancerBalance = await usdcContract.balanceOf(
          accounts[2].address
        );
        assert.equal(milestones[0].completed, true);
        assert.equal(milestones[1].completed, true);
        assert.equal(
          initialERC20OutOfVault - finalERC20OutOfVault,
          milestones[1].payment
        );
        assert.equal(
          finalFreelancerBalance - initialFreelancerBalance,
          milestones[1].payment
        );
      });
      it("should reject project already completed", async () => {
        let milestones = await deelance.getMilestones(1);
        assert.equal(milestones[0].completed, true);
        assert.equal(milestones[1].completed, true);
        await expect(
          deelance.connect(accounts[0]).milestoneCompleted(1, 0)
        ).to.be.rejectedWith("This project has been completed");
        milestones = await deelance.getMilestones(1);
        assert.equal(milestones[0].completed, true);
        assert.equal(milestones[1].completed, true);
      });
    });
  });
});
