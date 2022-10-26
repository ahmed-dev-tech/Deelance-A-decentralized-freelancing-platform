//SPDX-License-Identifier: UNLICENSED

//Manage basic Deelance functions.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "./Vault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// This is the main building block for smart contracts.
// To Do: Make each project an NFT
contract Deelance is Vault {
    // ALL PUBLIC VARIABLES

    // bank to hold fees
    address payable public feeBank;

    // percentage of fee to be collected
    uint8 public feePercent;

    // Id of all Projects
    uint public projectsId;

    // mapping project id to project struct
    mapping(uint=>Project)public projects;
    // END OF PUBLIC VARIABLES

    // ALL EVENTS
    
    event MilestoneAdded(uint indexed projectId,uint deadline,uint amount);
    event StartedProject(bytes32 indexed gig_orderId,uint id);
    // END OF EVENTS

    // milestone struct
    struct Milestone{
        uint deadline;
        uint payment;
        bool isERC;
        address token;
        bool completed;
    }
    // project struct
    struct Project{
        address payable client;
        address payable freelancer;
        uint budget;
        Milestone[] milestones;
        uint8 completedMilestones;
        bool completed;
        bool approved;
    }
    // END OF STRUCTS

    // ALL FUNCTIONS

    // initializer function
    function construct(address bank,uint8 percentage)public{
        // bank=0x741dFBFa5843311fEd71f65967cF2e766b9c33bd
        feeBank=payable(bank);
        feePercent=percentage;
    }
    // function to start a new project by client only
    function startProject(bytes32 gig_orderId,address freelancerAddress)public{
        require(msg.sender!=freelancerAddress,'You cannot work for yourself');
        if(!users[msg.sender].isClient){
            registerClient();
        }
        require(users[freelancerAddress].isFreelancer,'This freelancer does not exist');
        projectsId++;
        Project storage newProject=projects[projectsId];
        newProject.client=payable(msg.sender);
        newProject.freelancer=payable(freelancerAddress);
        newProject.budget=0;
        newProject.milestones;
        newProject.completed=false;
        newProject.approved=false;
        emit StartedProject(gig_orderId,projectsId);
    } 
    // function to accept invitation to start project
    function joinProject(uint projectId)public{
        // probably require the project has not been joined already
        require(users[msg.sender].isFreelancer,"You are not registered as a freelancer");
        require(projects[projectId].freelancer==msg.sender,"You are not the freelancer for this project");
        projects[projectId].approved=true;
    }
    // function to add milestone to projects
    function addMilestone(uint projectId,uint deadline,bool isERC,address _token,uint _amount)public payable{
        // probably will remove _ethAmount and leave _amount only
        require (projects[projectId].client==msg.sender,'You are not the owner of this project');
        if (!isERC){
            require(users[msg.sender].ethInVault>=_amount,"not enough eth in vault");
            projects[projectId].milestones.push(Milestone(
                deadline,
                _amount,
                isERC,
                _token,
                false
            ));
            users[msg.sender].ethInVault-=_amount;
            users[msg.sender].ethOutOfVault+=_amount;
        }else{
            // perform a check to know if token is actually an ERC20
            require(users[msg.sender].erc20InVault[_token]>=_amount,"not enough erc20 token in vault");
            projects[projectId].milestones.push(Milestone(
                deadline,
                _amount,
                isERC,
                _token,
                false
            ));
            users[msg.sender].erc20InVault[_token]-=_amount;
            users[msg.sender].erc20OutOfVault[_token]+=_amount;
        }
        emit MilestoneAdded(projectId,deadline, _amount);
    }
    //function to mark a milestone as completed 
    function milestoneCompleted(uint projectId,uint8 milestoneId)public{
        require(projects[projectId].client==msg.sender,'Only the project owner can call this function');
        require(!projects[projectId].completed,'This project has been completed');
        Project storage currentProject=projects[projectId];
        require (milestoneId<currentProject.milestones.length,"This milestone does not exist");
        Milestone storage currentMilestone=currentProject.milestones[milestoneId];
        require (!currentMilestone.completed,"This milestone has been marked as completed");
        if(!currentMilestone.isERC){
            // change transfer to call
            currentProject.freelancer.transfer(currentMilestone.payment);
            users[msg.sender].ethOutOfVault-=currentMilestone.payment;
        }else{
            IERC20(currentMilestone.token).transfer(currentProject.freelancer, currentMilestone.payment);
            users[msg.sender].erc20OutOfVault[currentMilestone.token]-=currentMilestone.payment;
        }
        currentMilestone.completed=true;
        currentProject.completedMilestones++;
        if (currentProject.completedMilestones==currentProject.milestones.length){
            currentProject.completed=true;
        }
    }
    // function to get a milestone(read only)
    function getMilestones(uint projectId)public view returns(Milestone[] memory milestone){
        return projects[projectId].milestones;
    }
}