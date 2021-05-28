pragma solidity >=0.7.0 <0.9.0;

contract DocVerify {
    
    struct Document {
        address owner;
        uint date;
    }
    
    address public creator;
    uint public numDocuments;
    mapping(bytes => Document) public documentHashMap;
    
    constructor() {
        creator = msg.sender;
        numDocuments = 0;
    }
    
    // function newDocument(bytes32 hashFunction, bytes32 digest, uint size) public returns (bool success) {
    function newDocument(bytes memory hash) public returns (bool success) {
        // bytes memory hash = new bytes(size);
        
        if (documentExists(hash)) {
            success = false;
        }else {
            Document storage d = documentHashMap[hash];
            d.owner = msg.sender;
            d.date = block.timestamp;
            numDocuments++;
            success = true;
        }
        return success;
    }
    
    function documentExists(bytes memory hash) public view returns (bool exists) {
        if (documentHashMap[hash].date > 0) {
            exists = true;
        } else {
            exists = false;
        }
        return exists;
    }
    
    function getDocument(bytes memory hash) public view returns (uint date, address owner) {
        date = documentHashMap[hash].date;
        owner = documentHashMap[hash].owner;
    }

    function getNumDocs() public view returns (uint numDocs) {
        return numDocuments;
    }
}