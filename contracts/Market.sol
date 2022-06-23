// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "./PuppyNFT.sol";
import "./Token.sol";

contract Market {
    Token private _token;
    PuppyNFT private _puppy;
    address _admin;
    uint256 private poolBalance = 0 ;
    
    struct UserInfo {
        uint256[] dogId; // Dog ID
        uint256[] price; // Crate price(microshiba  token)
        uint256[] start; // Staking start date
        uint256[] end; // Staking end date
        uint256[] apy; // Staking APY 100 = 1%
        uint256[] reward; // Staking rewards(microshiba token)
    }

    mapping(address => UserInfo) private userInfo;
    
    event Deposit(address indexed sender, uint256 price, uint256 rewards, uint256 startDate);
    event Withdraw(address indexed sender, uint256 price, uint256 rewards);
    
    constructor(Token token, PuppyNFT puppy, address admin) {
        _token = token;
		_puppy = puppy;
		_admin = admin;
    }
    
    /**
     * @notice Checks if the msg.sender is the admin address
     */
    modifier onlyAdmin() {
        require(msg.sender == _admin, "The right is not allowed");
        _;
    }
    
    /**
     * @notice Checks if the msg.sender is a contract or a proxy
     */
    modifier notContract() {
        require(!_isContract(msg.sender), "contract not allowed");
        require(msg.sender == tx.origin, "proxy contract not allowed");
        _;
    }
    
    /**
     * Change the admin of the contract
     */
	function ChangeAdmin(address account) public onlyAdmin{
	    _admin = account;
	}
    
    /**
     * Add the microshiba token to the market staking pool
     */
	function DepositToken(uint256 amount) public onlyAdmin notContract{
	    _token.code_approve(msg.sender, address(this), amount);
        _token.transferFrom(msg.sender, address(this), amount);
	}
	
	/**
     * Withdraw the microshiba token from the market staking pool
     */
	function WithdrawToken(uint256 amount, address receiver) public onlyAdmin notContract{
	    _token.code_approve(address(this), address(this), amount);
	    _token.transferFrom(address(this), receiver, amount);
	}
	
    //event Purchase(address indexed buyer, uint256 price, uint256 dogType);

    function purchaseCrate(address marketplace, uint256 price, uint256 dogType) public {
        address buyer = msg.sender;
        require (
			_token.balanceOf(buyer) > price,
			"You do not have Microshiba token to buy this."
		);
		
        _token.code_approve(buyer, marketplace, price);
        _token.transferFrom(buyer, marketplace, price);

         _puppy.transferPuppy(buyer, dogType);
    }
	event Purchase(address indexed buyer, address seller, uint256 crateId);
	
	// Purchase the dog from the secondary market hosted by organiser
    function secondaryPurchase(address marketplace, uint256 dogId) public {
        address seller;
        uint sellingPrice;
		seller = _puppy.ownerOf(dogId);
		sellingPrice = _puppy.getSellingPrice(dogId);
        
        address buyer = msg.sender;        
        uint256 commision = (sellingPrice * 5) / 100;		
		
        _token.code_approve(buyer, marketplace, sellingPrice);
        _token.transferFrom(buyer, seller, sellingPrice - commision);
        _token.transferFrom(buyer, address(this), commision);

       _puppy.secondaryTransferPuppy(buyer, dogId);	

        emit Purchase(buyer, seller, dogId);
    }	

    /**
     * @notice Deposits funds into the market staking pool
     * @param dogId: Dog ID
     */
    function stakeDog(uint256 dogId, uint256 price, uint256 start, uint256 end, uint256 apy, uint256 reward) public notContract {
        require(price > 0, "Nothing to deposit");

        poolBalance = poolBalance + price;
        
        _puppy.code_approve(address(this), dogId);
        _puppy.setStakeDetails(dogId, address(this));
        
        userInfo[msg.sender].dogId.push(dogId);
        userInfo[msg.sender].price.push(price);
        userInfo[msg.sender].start.push(start);
        userInfo[msg.sender].end.push(end);
        userInfo[msg.sender].apy.push(apy);
        userInfo[msg.sender].reward.push(reward);
        
        emit Deposit(msg.sender, price, reward, start);
    }
    
     /**
     * @notice Get the staked dogs of each user
     * @param dogId: Dog ID
     */
    function getStakeStatus(uint256 dogId) public view returns (uint256 start, uint256 end, uint256 apy, uint256 reward) {
        
        UserInfo storage user = userInfo[msg.sender];
        
        for (uint256 i = 0; i < user.dogId.length; i++) {
            if (user.dogId[i] == dogId) {
                return (
                    user.start[i], user.end[i], user.apy[i], user.reward[i]
                );
            }
        }
        return (0,0,0,0);
    }
    
    /**
     * @notice Withdraws the NFT from the market staking pool and receive the reward
     * @param dogId: Dog ID
     */
    function unStake(uint256 dogId, uint256 price, uint256 reward) public notContract {
        UserInfo storage user = userInfo[msg.sender];
        uint256 numberOfStake = user.dogId.length;
        uint256 label = 1000000000000000000000000;
        for (uint256 i = 0; i < numberOfStake; i++) {
            if (user.dogId[i] == dogId) {
                label = i;
            }
        }
        
		require(label != 1000000000000000000000000, "The dog was not staked");
	    require(price <= poolBalance, "Withdraw amount exceeds balance");
	    
        poolBalance = poolBalance - price;
        
        if (label != (numberOfStake-1)) {
		    for (uint256 j = label; j < numberOfStake; j++) {
			    user.dogId[j] = user.dogId[j+1];
			    user.price[j] = user.price[j+1];
			    user.start[j] = user.start[j+1];
			    user.end[j] = user.end[j+1];
			    user.apy[j] = user.apy[j+1];
			    user.reward[j] = user.reward[j+1];
			}
	    }
		user.dogId.pop();
		user.price.pop();
		user.start.pop();
		user.end.pop();
		user.apy.pop();
		user.reward.pop();
		
		_puppy.setUnstakeDetails(dogId, msg.sender);
		
		_token.code_approve(address(this), address(this), reward);
		_token.transferFrom(address(this), msg.sender, reward);

        emit Withdraw(msg.sender, price, reward);
    }
    
    /**
     * @notice Custom logic for how much the vault allows to be borrowed
     * @dev The contract puts 100% of the tokens to work.
     */
    function poolBalanceOf() public view returns (uint256) {
        return poolBalance;
    }

    /**
     * @notice Calculates the total underlying tokens
     * @dev It includes tokens held by the contract and held in MasterChef
     */
    function balanceOf() public view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    /**
     * @notice Checks if address is a contract
     * @dev It prevents contract from being targetted
     */
    function _isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
