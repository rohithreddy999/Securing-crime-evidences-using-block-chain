pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  string ipfsHash;
  string caseno;
  string casename;
  string description;

  event crimeAdded(
    string ipfsHash,
    string caseno,
    string casename,
    string description
  );


  function set(string memory x,string memory y,string memory z,string memory desc) public {
    ipfsHash = x;
    caseno = y;
    casename = z;
    description = desc;

    emit crimeAdded(ipfsHash,caseno,casename,description);


  }

  // function get() public view returns (string) {
  //   return ipfsHash;
  // }
}
