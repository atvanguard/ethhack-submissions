pragma solidity ^0.4.24;

contract HackSubmissions {
  uint256 public hackathonCounter;

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
    string details;
    uint256 prizes;
    uint256 startsAt;
    uint256 endsAt;
    // uint256 duration; // seconds
    // whitelisted teams
    address[] teamLeads;
    mapping(address => Team) teams;
    // Submission[] submissions; 
  }

  // id to hackathon struct
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

  modifier verifyTeam(bytes32 hackId, address teamId) {
    require(hackathons[hackId].teams[teamId].id != address(0));
    _;
  }

  /** @dev Creates a new hackathon.
      * @param name Name of the hackathon.
      * msg.value Collective bag of hackathon prizes
      * @return id The Hackathon id
      */
  function createHackathon(
      string name,
      string details,
      uint256 startsAt,
      uint256 endsAt)
      public payable returns (bytes32) {
    bytes32 id = bytes32(hackathonCounter++);
    Hackathon memory hackathon = Hackathon(
      id,
      msg.sender, // organizer
      name,
      details, // Hash of the hackathon data, e.g. questionnaire
      msg.value, // Collective bag of hackathon prizes
      startsAt,
      endsAt,
      new address[](0) // registered teams
    );
    // @todo emit event?
    hackathons[id] = hackathon;
    return id;
  }

  function registerTeam(uint256 _hackId, string name)
      public
      validHackathon(bytes32(_hackId)) {
    address id = msg.sender;
    bytes32 hackId = bytes32(_hackId);
    require(hackathons[hackId].teams[id].id == address(0));
    Team memory team = Team(id, hackId, name, "");
    hackathons[hackId].teamLeads.push(id);
    hackathons[hackId].teams[id] = team;
  }

  function createSubmission(uint256 _hackId, string content)
      public
      verifyTeam(bytes32(_hackId), msg.sender) {
    hackathons[bytes32(_hackId)].teams[msg.sender].content = content;
  }

  // function getTeam(bytes32 hackId, address id) public view {

  // }

  // function endHackathon(bytes32 hackId)
  //     public
  //     onlyOrganizer(hackId, msg.sender) {
  //   hackathons[hackId].isOver = true;
  //   // @todo transfer back remaining prize amount to owner?  
  // }

  function getHackathon(uint256 _id)
      public view
      validHackathon(bytes32(_id))
      returns(address organizer, string name, string details,
          uint256 prizes, uint256 startsAt, uint256 endsAt, uint256 numTeams) {
    bytes32 id = bytes32(_id);
    Hackathon storage hackathon = hackathons[id];
    organizer = hackathon.organizer;
    name = hackathon.name;
    details = hackathon.details;
    prizes = hackathon.prizes;
    startsAt = hackathon.startsAt;
    endsAt = hackathon.endsAt;
    numTeams = hackathon.teamLeads.length;
  }

  function getTeams(uint256 _hackId)
      public view
      validHackathon(bytes32(_hackId))
      returns (address[]) {
    return hackathons[bytes32(_hackId)].teamLeads;
  }

  function getTeam(uint256 _hackId, address teamId)
      public view
      validHackathon(bytes32(_hackId))
      returns (string name, string content) {
    bytes32 hackId = bytes32(_hackId);
    require(hackathons[hackId].teams[teamId].id != address(0), 'Team not registered');
    // Team storage team = hackathons[hackId].teams[teamId].name;
    name = hackathons[hackId].teams[teamId].name;
    content = hackathons[hackId].teams[teamId].content;
  } 

  // function isHackathonOver(bytes32 id) internal view returns(bool isOver) {
  //   Hackathon storage hack = hackathons[id];
  //   isOver = (hack.startsAt + hack.duration >= now ? true : false);
  // }

  // function getHackathons() public view returns(bytes32[]) {
  //   bytes32[hackathonCounter] memory hacks;
  //   // for(uint256 i = 0; i < hackathonCounter; i++) {
  //   //   // hacks[i] = bytes32(hackathons[bytes32(i)].name);
  //   //   hacks[i] = hackathons[bytes32(i)].name;
  //   // }
  //   return hacks;
  // }
}