// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RefundDistributor
 * @dev Simple distributor contract that sends 1 VAL token to anyone who calls claim()
 * This is for the refund functionality - returns 1 VAL to users
 */
contract RefundDistributor is Ownable {
    IERC20 public immutable valToken;
    
    // Amount to distribute per claim (1 VAL = 1 * 10^18)
    uint256 public constant CLAIM_AMOUNT = 1 * 10**18;
    
    event Claimed(address indexed user, uint256 amount);
    
    constructor(address _valToken) Ownable(msg.sender) {
        valToken = IERC20(_valToken);
    }
    
    /**
     * @dev Allows anyone to claim 1 VAL token
     * No restrictions - anyone can claim multiple times
     */
    function claim() external {
        require(valToken.balanceOf(address(this)) >= CLAIM_AMOUNT, "Insufficient VAL balance");
        
        bool success = valToken.transfer(msg.sender, CLAIM_AMOUNT);
        require(success, "VAL transfer failed");
        
        emit Claimed(msg.sender, CLAIM_AMOUNT);
    }
    
    /**
     * @dev Owner can deposit VAL tokens to fund the distributor
     */
    function deposit(uint256 amount) external onlyOwner {
        require(valToken.transferFrom(msg.sender, address(this), amount), "Deposit failed");
    }
    
    /**
     * @dev Owner can withdraw remaining VAL tokens
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(valToken.transfer(msg.sender, amount), "Withdrawal failed");
    }
    
    /**
     * @dev Get the current VAL balance of this contract
     */
    function getBalance() external view returns (uint256) {
        return valToken.balanceOf(address(this));
    }
}

