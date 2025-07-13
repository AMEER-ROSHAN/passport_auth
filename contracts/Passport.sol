// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PassportAuth {
    struct Passport {
        string name;
        uint256 passportNumber;
        string country;
        uint256 issueDate;
        uint256 expiryDate;
        address owner;
    }

    mapping(uint256 => Passport) public passports; // Maps passportNumber to Passport
    mapping(address => uint256[]) public ownerPassports; // Maps owner's address to their passport numbers

    event PassportCreated(uint256 passportNumber, address owner);

    // Create a new passport
    function createPassport(
        uint256 _passportNumber,
        string memory _name,
        string memory _country,
        uint256 _issueDate,
        uint256 _expiryDate
    ) public {
        // Ensure the passport does not already exist
        require(passports[_passportNumber].passportNumber == 0, "Passport already exists");

        // Create the passport
        Passport memory newPassport = Passport({
            name: _name,
            passportNumber: _passportNumber,
            country: _country,
            issueDate: _issueDate,
            expiryDate: _expiryDate,
            owner: msg.sender
        });

        passports[_passportNumber] = newPassport; // Save passport
        ownerPassports[msg.sender].push(_passportNumber); // Track owner's passports
        
        emit PassportCreated(_passportNumber, msg.sender);
    }
    
    // Verify passport by public key (owner address)
    // Verify passport by public key (owner address) and check if not expired
    function verifyPassportByAddress(address _owner) public view returns (bool) {
        uint256[] memory ownerPassportList = ownerPassports[_owner];
        if (ownerPassportList.length == 0) return false;

        for (uint i = 0; i < ownerPassportList.length; i++) {
            Passport memory p = passports[ownerPassportList[i]];
            if (block.timestamp < p.expiryDate) {
                return true; // Valid and not expired
            }
        }
        return false; // All expired
    }


    // Retrieve passports associated with a specific public key (owner address)
    function getOwnerPassports(address _owner) public view returns (uint256[] memory) {
        return ownerPassports[_owner];
    }
}
