pragma solidity ^0.4.24;

contract HackSubmissions {
  uint256 hackathonCounter;

  struct Team {
    // ETH address of the team that also acts as the unique id
    address id;
    // hackathon ID, the team is a part of
    bytes32 hackId;
    string name;
    // IPFS hash of the submission
    string content;
    // @todo add ETH addresses of the individual team members
  }

  struct Submission {
    bytes32 id;
    string content;
    Team team;
  }

  struct Hackathon {
    bytes32 id;
    address organizer;
    string name;
    uint256 prizes;
    bool isOver;
    // whitelisted teams
    mapping(address => Team) teams;
    // Team[] teams;
    // Submission[] submissions; 
  }

  mapping(bytes32 => Hackathon) hackathons;

  // constructor(uint initialValue) public {
  //   storedData = initialValue;
  // }

  modifier validHackathon(bytes32 id) {
    require(hackathons[id].organizer != address(0));
    _;
  }

  modifier onlyOrganizer(bytes32 id, address sender) {
    require(hackathons[id].organizer == sender);
    _;
  }

  modifier verifyTeam(address teamId, bytes32 hackId) {
    require(hackathons[hackId].teams[teamId].id != address(0));
    _;
  }

  /** @dev Creates a new hackathon.
      * @param name Name of the hackathon.
      * msg.value Collective bag of hackathon prizes
      * @return id The Hackathon id
      */
  function createHackathon(string name) public payable returns (bytes32) {
    bytes32 id = bytes32(hackathonCounter++);
    Hackathon memory hackathon = Hackathon(id, msg.sender, name, msg.value, false);
    // @todo emit event?
    hackathons[id] = hackathon;
    return id;
  }

  function addTeam(bytes32 hackId, string name)
      public
      validHackathon(hackId) {
    address id = msg.sender;
    require(hackathons[hackId].teams[id].id == address(0));
    Team memory team = Team(id, hackId, name, '0');
    hackathons[hackId].teams[id] = team;
  }

  function createSubmission(bytes32 hackId, string content)
      public
      verifyTeam(msg.sender, hackId) {
    hackathons[hackId].teams[msg.sender].content = content;
  }

  // function getTeam(bytes32 hackId, address id) public view {

  // }

  function endHackathon(bytes32 hackId)
      public
      onlyOrganizer(hackId, msg.sender) {
    hackathons[hackId].isOver = true;
    // @todo transfer back remaining prize amount to owner?  
  }
}