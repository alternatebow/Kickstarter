// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    uint testNum = 5;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function getTestNum() public view returns(uint) {
        return testNum;
    }
}

contract Campaign {
    // Struct when defined do not automatically create a local instance
    // unlike your typical state variables
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint256 public minContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    
    modifier restricted {
        require (msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) 
        public restricted {
            // Use field syntax to clarify parameters
            // With the key value form, we can change the order without issue
            Request storage newRequest = requests.push();
            newRequest.description = description;
            newRequest.value = value;
            newRequest.recipient = recipient;
            newRequest.complete = false;
            newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2) );
        require(!request.complete);

        request.complete = true;
        payable(request.recipient).transfer(request.value);
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
        ) {
            return (
                minContribution,
                address(this).balance,
                requests.length,
                approversCount,
                manager
            );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
