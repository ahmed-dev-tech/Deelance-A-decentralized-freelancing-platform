// Manage funding of projects and storing of funds
//SPDX-License-Identifier: UNLICENSED

//Manage basic Deelance functions.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault{
    // Id of All Users
    uint public usersId;

    // mapping Id to address of All Users
    mapping(address=>User) public users;

    // ALL STRUCTS
    struct User{
        uint userId;
        bool isClient;
        bool isFreelancer;
        uint ethInVault;
        uint ethOutOfVault;
        mapping(address=>uint) erc20InVault;
        mapping(address=>uint) erc20OutOfVault;
    }
        // function to register a new client
    function registerClient() public{
        require (!users[msg.sender].isClient,'This address is registered as a client');
        User storage newClient=users[msg.sender];
        if (newClient.userId!=0){
            newClient.isClient=true;
            return;
        }
        usersId++;
        newClient.userId=usersId;
        newClient.isClient=true;
        return;
    }
    // function to register a new freelancer
    function registerFreelancer() public{
        require (!users[msg.sender].isFreelancer,'This address is registered as a freelancer');
        User storage newFreelancer=users[msg.sender];
        if (newFreelancer.userId!=0){
            newFreelancer.isFreelancer=true;
            return;
        }
        usersId++;
        newFreelancer.userId=usersId;
        newFreelancer.isFreelancer=true;
        return;
    }

    function fundWithERC20(uint256 _amount, address _token)public {
        IERC20 token = IERC20(_token);
        require(
            token.allowance(msg.sender, address(this)) >= _amount,
            "There is no amount approved to spend"
        );
        uint balance=token.balanceOf(address(this));
        token.transferFrom(msg.sender, address(this), _amount);
        if(token.balanceOf(address(this))-balance>=_amount){
            User storage caller=users[msg.sender];
            caller.erc20InVault[_token]+=_amount;
        }
        return;
    }
    // Test functions
    
    // end of test functions
    function getEthInVault(address depositor)public view returns(uint){
        return users[depositor].ethInVault;
    }
    function getEthOutOfVault(address depositor)public view returns(uint){
        return users[depositor].ethOutOfVault;
    }
    function getERC20InVault(address depositor,address tokenAddress)public view returns(uint){
        return users[depositor].erc20InVault[tokenAddress];
    }
    function getERC20OutOfVault(address depositor,address tokenAddress)public view returns(uint){
        return users[depositor].erc20OutOfVault[tokenAddress];
    }
    receive()external payable{
        User storage caller=users[msg.sender];
        caller.ethInVault+=msg.value;
    }
}