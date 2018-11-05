pragma solidity ^0.4.24;

import "./ERC721.sol";

contract ERC721Token is ERC721 {

    mapping(uint256 => address) tokenToOwner;
    mapping(address => uint256) ownerToBalance;
    mapping(uint256 => address) tokenToApproved;
    mapping(address => mapping(address => bool)) ownerToOperator;

    modifier hasPermission(address _caller, uint256 _tokenId) { 
        require(
            _caller == tokenToOwner[_tokenId] || 
            getApproved(_tokenId) == _caller || 
            isApprovedForAll(tokenToOwner[_tokenId], _caller));
        _;
    }

    function mint(uint256 _tokenId) public {
        require(tokenToOwner[_tokenId] == address(0), "this token belongs to someone else already");
        tokenToOwner[_tokenId] == msg.sender;
        ownerToBalance[msg.sender] += 1;
        emit Transfer(address(0), msg.sender, _tokenId);
    }

    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to the zero address are considered invalid, and this
    ///     function throws for queries about the zdro address
    function balanceOf(address _owner) external view returns(uint256) {
        require(_owner != address(0), "cannot ask of balance of address 0");
        return ownerToBalance[_owner];
    }

    /// @notice Find the owner of an NFT
    function ownerOf(uint256 _tokenId) external view returns (address) {
        return tokenToOwner[_tokenId];
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable {
        // WILL NOT IMPLEMENT
    }

    function safeTransformFrom(address _from, address _to, uint256 _tokenId) external payable {
        // WILL NOT IMPLEMENT
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable hasPermission(msg.sender, _tokenId) {
        tokenToOwner[_tokenId] = _to;
        ownerToBalance[_from] -= 1;

        emit Transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable {
        require(tokenToOwner[_tokenId] == msg.sender);
        tokenToApproved[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        ownerToOperator[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) public view returns (address) {
        return tokenToApproved[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
        return ownerToOperator[_owner][_operator];
    }
}