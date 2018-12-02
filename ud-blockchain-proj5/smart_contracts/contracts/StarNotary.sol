pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

// Related Udacity Lesson
// https://classroom.udacity.com/nanodegrees/nd1309/parts/2e478a90-310b-4703-aa20-efec12eb258c/modules/f1d81730-f430-46fb-a490-0f260a65f997/lessons/6cd7e4ac-79b4-43bd-9db9-2459a99164a1/concepts/46374703-d28d-421d-a4d3-f6968ee31444

contract StarNotary is ERC721 {
    struct Star {
        string name;
        string ra;
        string dec;
        string mag;
        string story;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => bool) public starHashmap;
    mapping(uint256 => uint256) internal tokenIdForSale2Index;

    uint256[] allStarIdsForSale;

    function createStar(string name, string ra, string dec, string mag, string story, uint256 tokenId) public {
        Star memory newStar = Star(name, ra, dec, mag, story);

        // check if tokenId already exists
        require(getHash(tokenIdToStarInfo[tokenId].ra) == getHash(""));

        // check if inputs are valid
        require(getHash(name) != getHash(""));
        require(getHash(ra) != getHash(""));
        require(getHash(dec) != getHash(""));
        require(getHash(mag) != getHash(""));
        require(tokenId != 0);

        // check if star already exists
        require(!checkIfStarExist(ra, dec, mag));

        tokenIdToStarInfo[tokenId] = newStar;

        bytes32 starHash = keccak256(abi.encodePacked(ra, dec, mag));
        starHashmap[starHash] = true;

        _mint(msg.sender, tokenId);
    }

    function putStarUpForSale(uint256 tokenId, uint256 price) public {
        require(this.ownerOf(tokenId) == msg.sender);

        starsForSale[tokenId] = price;
        tokenIdForSale2Index[tokenId] = allStarIdsForSale.length;
        allStarIdsForSale.push(tokenId);
    }

    function buyStar(uint256 tokenId) public payable {
        require(starsForSale[tokenId] > 0);

        uint256 starCost = starsForSale[tokenId];
        address starOwner = this.ownerOf(tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, tokenId);
        _addTokenTo(msg.sender, tokenId);

        uint256 index = tokenIdForSale2Index[tokenId];
        delete allStarIdsForSale[index];

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string ra, string dec, string mag) public view returns(bool) {
        bytes32 starHash = keccak256(abi.encodePacked(ra, dec, mag));
        return starHashmap[starHash];
    }

    function mint(uint256 tokenId) public {
        super._mint(msg.sender, tokenId);
    }

    function tokenIdToStarInfo(uint256 tokenId) public view 
        returns(string name, string story, string ra, string dec, string mag) 
    {
        Star memory star = tokenIdToStarInfo[tokenId];
        name = star.name;
        story = star.story;
        ra = star.ra;
        dec = star.dec;
        mag = star.mag;
    }

    function allStarsForSale() public view returns(uint256[]) {
        return allStarIdsForSale;
    } 

    function approve(address to, uint256 tokenId) public {
        super.approve(to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        super.safeTransferFrom(from, to, tokenId);
    }

    function SetApprovalForAll(address to, bool approved) public {
        super.setApprovalForAll(to, approved);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        return super.getApproved(tokenId);
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return super.isApprovedForAll(owner, operator);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return super.ownerOf(tokenId);
    }

    function stringEquals(string a, string b) internal pure returns (bool) {
        return getHash(a) == getHash(b);
    }

    function getHash(string str) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(str));
    }
}