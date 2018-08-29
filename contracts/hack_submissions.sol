pragma solidity ^0.4.24;

contract HackSubmissions {
  uint256 public hackathonCounter;

  struct Comment {
    address teamId;
    string content;
  }

  struct Team {
    // ETH address of the team that also acts as the unique id
    address id;
    // hackathon ID, the team is a part of
    bytes32 hackId;
    string name;
    // IPFS hash of the submission
    string content;
    address[] votes;
    // Unimplemented feature:
// /tmp/solidity-20180725-35430-5ohcik/solidity_0.4.24/libsolidity/codegen/ArrayUtils.cpp(215): Throw in function auto dev::solidity::ArrayUtils::copyArrayToStorage(const dev::solidity::ArrayType &, const dev::solidity::ArrayType &)::(anonymous class)::operator()(dev::solidity::CompilerContext &) const
// Dynamic exception type: boost::exception_detail::clone_impl<dev::solidity::UnimplementedFeatureError>
// std::exception::what: Copying of type struct HackSubmissions.Comment memory[] memory to storage not yet supported.
// [dev::tag_comment*] = Copying of type struct HackSubmissions.Comment memory[] memory to storage not yet supported.
// Comment[] comments;
    string[] comments;
    mapping(uint => address) commentWriter;
    // @todo add ETH addresses of the individual team members
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
    Team memory team = Team(id, hackId, name, "", new address[](0), new string[](0));
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
      returns (string name, string content, uint256 numVotes, uint numComments) {
    bytes32 hackId = bytes32(_hackId);
    Team storage team = hackathons[hackId].teams[teamId];
    require(team.id != address(0), 'Team not registered');
    // Team storage team = hackathons[hackId].teams[teamId].name;
    name = team.name;
    content = team.content;
    numVotes = team.votes.length;
    numComments = team.comments.length;
  }

  function getComment(uint256 _hackId, address teamId, uint index)
      public view
      verifyTeam(bytes32(_hackId), teamId)
      returns (string content, address writer) {
    bytes32 hackId = bytes32(_hackId);
    Team storage team = hackathons[hackId].teams[teamId];
    require(index >= 0 && index < team.comments.length);
    content = team.comments[index];
    writer = team.commentWriter[index];
  } 

  function comment(uint256 _hackId, address teamId, string content)
    public
    verifyTeam(bytes32(_hackId), msg.sender) // only other teams are allowed to upvote
    verifyTeam(bytes32(_hackId), teamId) // verify voting for registered team
  {
    Team storage team = hackathons[bytes32(_hackId)].teams[teamId];
    team.comments.push(content);
    team.commentWriter[team.comments.length - 1] = msg.sender;
    // team.comments.length++;
    // team.comments[team.comments.length - 1] = Comment(msg.sender, content);
  }

  function upvote(uint256 _hackId, address teamId)
    public
    verifyTeam(bytes32(_hackId), msg.sender) // only other teams are allowed to upvote
    verifyTeam(bytes32(_hackId), teamId) // verify voting for registered team
  {
    Team storage team = hackathons[bytes32(_hackId)].teams[teamId];
    require(!hasVoted(team, msg.sender), 'Already voted');
    team.votes.push(msg.sender);
  }

  function hasVoted(Team storage team, address voter) internal view returns (bool) {
    for(uint256 i = 0; i < team.votes.length; i++) {
      if (team.votes[i] == voter) {
        return true;
      }
    }
    return false;
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