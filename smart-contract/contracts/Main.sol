// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
/** 
 * @title Zuri School Voting
 * @dev Implements voting process along with vote delegation
 */

contract ZuriSchoolVoting {

   //@dev define the stakeholders allowed on the system
   enum Stakeholder {
       DIRECTOR,
       TEACHER,
       STUDENT
    }

    //@dev this is the voter struct that is used to hold the details of a voter
    struct Voter {
        string name;
        bool canVote;
        Stakeholder user_type;
    }
    

    //@dev this is a proposal on the contract, a proposal is simply an option in an election
    struct Proposal {
        string name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    //@dev this defines a ballot struct which is used to store a single election instance
    struct Election {
        uint256 _id;
        uint256 num_choices;
        string name;
        string description;
        bool active;
        bool computed;
    }

    // @dev this is used to keep track of the count of elections
    uint256 public electionCount = 0;

    // @dev store the address of the chairperson
    address public chairperson;

    // @dev store the name of the school
    string public schoolName;

    // @dev keep track of all the registered voters on the contract
    address[] voter_addresses;

    // @dev a mapping that maps the address of a voter to the voter struct
    mapping(address => Voter) public voters;

    // @dev a mapping that keeps track of an election id to the election struct
    mapping(uint256 => Election) public elections;

    // @dev this is a mapping of mappings used to keep track of if a voter has voted in an election already
    mapping(uint256 => mapping(address=>bool)) hasVoted;

    // @dev this is used to keep track of the weight of the votes of a specific user type
    mapping(Stakeholder => uint256) weights;

    // @dev this is used to keep track of the timers for the various elections
    mapping(uint256=>uint256) timers;

    // @dev this is used to keep track of the winnig proposal for each election
    mapping(uint256=>Proposal) winners;
    
    // @dev this is a mapping to track the choices for various elections
    mapping(uint256=>Proposal[])choices;

    // @dev this is used to assert that the person calling a contract method is a student
    modifier isStudent(){
       require(voters[msg.sender].user_type == Stakeholder.STUDENT, "only students can perform this operation");
       _;
    }

    // @dev this is used to assert that the person calling a contract method is the chairperson
    modifier isChairperson(){
        require(msg.sender == chairperson, "only chairperson can perform this operation");
        _;
    }

    // @dev this is used to assert that the person calling a contract method is a teacher
    modifier isTeacher(){
        require(voters[msg.sender].user_type == Stakeholder.TEACHER, "only teachers can perform this operation");
        _;
    }

    // @dev this is used to assert that the person calling a contract method is a director
    modifier isDirector(){
        require(voters[msg.sender].user_type == Stakeholder.DIRECTOR, "only director can perform this operation");
        _;
    }

    modifier isDirectorOrTeacher(){
        require(voters[msg.sender].user_type == Stakeholder.DIRECTOR || voters[msg.sender].user_type == Stakeholder.TEACHER, "only directors and teachers can perform this operation");
        _;
    }

    // @setup for all the various events carried out on the contract
    event BallotCreated(uint256 _id, string name, uint256 time);
    event BallotStarted(uint256 _id, string name, uint256 time);
    event voteCasted(uint256 _electionId, address _voter);
    event BallotStoped(uint256 _id, string name, uint256 time);
    event BallotResultCompiled(uint256 _id, string name, uint256 time);
    event StudentCreated(string name, address _student);
    event TeacherCreated(string name, address _teacher);
    event DirectorCreated(string name, address _director);
    event BanVoter(string name, address _voter);
    event UnbanVoter(string name, address _voter);


    // @ the contructor for setting  up defaults in the contract
    constructor(string memory _schoolName) {
        chairperson = msg.sender;
        schoolName = _schoolName;
        // create director voter for chairperson
        Voter memory _voter = Voter("chairperson", true, Stakeholder.DIRECTOR);
        voters[msg.sender] = _voter;
        addVoter(msg.sender);
        emit DirectorCreated("chairperson", msg.sender);
        weights[Stakeholder.STUDENT] = 1;
        weights[Stakeholder.TEACHER] = 1;
        weights[Stakeholder.DIRECTOR] = 1;
    }
    // @function used to check if two strings are equal
    function stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
    bytes memory b1 = bytes(s1);
    bytes memory b2 = bytes(s2);
    uint256 l1 = b1.length;
    if (l1 != b2.length) return false;
    for (uint256 i=0; i<l1; i++) {
        if (b1[i] != b2[i]) return false;
    }
    return true;
    }

    // @method to check if address is in the list of voter addresses
    function isVoter(address _voter) private view returns(bool){
        for(uint256 i = 0; i < voter_addresses.length; i ++ ){
            if(voter_addresses[i] == _voter){
                return true;
            }
        }
        return false;
    }

    // @ method used to add an address to our list of voters on the contract
    function addVoter(address _voter) private {
        if (!isVoter(_voter)){
            voter_addresses.push(_voter);
        }
    }

    // used to check if an address is a chairperson
    function iamChairperson(address _chairperson)public view returns(bool){
        if(chairperson == _chairperson){
            return true;
        }
        return false;
    }
    
    // @ returns details about a user whose address is passed
    function whoami(address _voter) public view returns(string memory name, string memory usertype, bool canVote){
        string memory _usertype = "student";
        if(voters[_voter].user_type == Stakeholder.TEACHER){
            _usertype = "teacher";
        } else if(voters[_voter].user_type == Stakeholder.DIRECTOR){
            _usertype = "director";
        }

        return (voters[_voter].name, _usertype, voters[_voter].canVote);
    }

    // @dev this is used to create a student voter
    function addStudent(string memory _name, address _student) public isChairperson {
        Voter memory _voter = Voter(_name, true, Stakeholder.STUDENT);
        voters[_student]  = _voter;
        addVoter(_student);
        emit StudentCreated(_name, _student);
    }

    // @dev this is used to create a teacher voter
    function addTeacher(string memory _name, address _teacher) public isChairperson {
        Voter memory _voter = Voter(_name, true, Stakeholder.TEACHER);
        voters[_teacher]  = _voter;
        addVoter(_teacher);
        emit TeacherCreated(_name, _teacher);
    }
    
    // @dev this is used for adding a director voter
    function addDirector(string memory _name, address _director) public isChairperson {
        Voter memory _voter = Voter(_name, true, Stakeholder.DIRECTOR);
        voters[_director]  = _voter;
        addVoter(_director);
        emit DirectorCreated(_name, _director);
    }


    // @dev this method is used for creating an election either by a teacher or director
    function createElection(string memory _name, uint256 _num_choices, string memory _description, string[] memory _choices, uint256 numHours) public isDirectorOrTeacher {
        require(_num_choices > 1, "must have more than one choice to create election");
        require(_num_choices == _choices.length, "number of proposals must equal number of choices");
    
        uint _id = electionCount;

        uint expirationTime = block.timestamp + (numHours * (60*60));
        Election memory _election = Election(_id, _num_choices, _name, _description, false, false);
        for (uint256 i = 0; i < _num_choices; i++) {
            Proposal memory _proposal = Proposal(_choices[i], 0);
            choices[_id].push(_proposal);
        }
        timers[electionCount] = expirationTime;
        elections[_id] = _election;
        electionCount ++;
        emit BallotCreated(_id, _name, expirationTime);
    }

    // @dev this method is used to cast the vote of an election
    function castVote(uint256 _electionId, uint256 _proposalIndex) public {
        require(elections[_electionId].active == true, "election must be active to cast a vote");
        require(elections[_electionId].computed == false, "election result has already been computed, can not cast vote");
        require(timers[_electionId] >= block.timestamp, "election period has expired can not cast vote");
        require(voters[msg.sender].canVote == true, "you must be allowed to vote to perform this operation");
        require(hasVoted[_electionId][msg.sender] == false, "you have already voted for this election");

        // cast a vote based on the weight of that specific user type
        choices[_electionId][_proposalIndex].voteCount += weights[voters[msg.sender].user_type];
        hasVoted[_electionId][msg.sender] = true;

        emit voteCasted(_electionId, msg.sender);
    }
    
    // @dev this is the method to start an election
    function startElection(uint256 _electionId) public isChairperson{
        elections[_electionId].active = true;
        emit BallotStarted(_electionId, elections[_electionId].name, block.timestamp);
    }


    // @dev this is a method to stop an election
    function stopElection(uint256 _electionId) public isChairperson {
        elections[_electionId].active = false;
        timers[_electionId] = block.timestamp; 
        emit BallotStoped(_electionId, elections[_electionId].name, block.timestamp);
    }

    // @ dev get details about an election by providing its details
    function viewElection(uint256 _electionId) public view returns(string memory name, string[] memory props, bool isActive, bool isComputed){
        string[] memory proposals = new string[](choices[_electionId].length);
        for(uint256 i=0; i < choices[_electionId].length; i++){
            proposals[i] = choices[_electionId][i].name;
        } 
        return (elections[_electionId].name, proposals, elections[_electionId].active, elections[_electionId].computed);
    }

    // @dev view the statistics of a particular election
    function viewElectionStats(uint256 _electionId) public view returns(string[] memory names, string[] memory user_types, bool[] memory canVotes, bool[] memory hasVoteds){
        
        string[] memory _names = new string[](voter_addresses.length);
        string[] memory _user_types = new string[](voter_addresses.length);
        bool[] memory _canVotes = new bool[](voter_addresses.length);
        bool[] memory _hasVoteds = new bool[](voter_addresses.length);

        for(uint256 i = 0; i < voter_addresses.length; i++){
            _names[i] = voters[voter_addresses[i]].name;
            string memory _user_type = "";
            if(voters[voter_addresses[i]].user_type == Stakeholder.STUDENT){
                _user_type = "student";
            } else if (voters[voter_addresses[i]].user_type == Stakeholder.TEACHER){
                _user_type = "teacher";
            } else {
                _user_type = "director";
            }
            _user_types[i] = _user_type;
            _canVotes[i] = voters[voter_addresses[i]].canVote;
            _hasVoteds[i] = hasVoted[_electionId][voter_addresses[i]];
        }
        return (_names, _user_types, _canVotes, _hasVoteds);
    }

    function compileResults(uint256 _electionId) public isDirectorOrTeacher {
        stopElection(_electionId);
        elections[_electionId].computed = true;

        Proposal memory _max = choices[_electionId][0];
        for(uint256 i = 1; i < choices[_electionId].length; i++){
          if(choices[_electionId][i].voteCount > _max.voteCount){
              _max = choices[_electionId][i];
          }
        }

        winners[_electionId] = _max;
        emit BallotResultCompiled(_electionId, elections[_electionId].name, block.timestamp);
    }
    function viewResult(uint256 _electionId) public view returns(string memory electionName, string memory proposalName, uint256 voteCount){
        require(elections[_electionId].computed == true, "results have not yet been compiled");
        return (elections[_electionId].name, winners[_electionId].name, winners[_electionId].voteCount);
    }

    // @ this is a method used to customize the vote weight for the various stakeholders
    function setWeight(string memory stakeholder, uint256 weight) public isChairperson {
        require(weight >= 0, "weights can not be less than 1");
        if(stringsEquals(stakeholder,"student")){
            weights[Stakeholder.STUDENT] = weight;
        } else if(stringsEquals(stakeholder,"teacher")){
            weights[Stakeholder.TEACHER] = weight;
        } else if(stringsEquals(stakeholder,"director")){
            weights[Stakeholder.DIRECTOR]  = weight;
        }else {
            require(false, "invalid stakeholder name entered");
        }
    }

    // @dev ban a voter from voting on the contract
    function banVoter(address _voter) public isChairperson {
        voters[_voter].canVote = false;
        emit BanVoter(voters[_voter].name, _voter);
    }

    // @dev unban a voter from voting on the contract
    function unbanVoter(address _voter) public isChairperson{
        voters[_voter].canVote = true;
        emit UnbanVoter(voters[_voter].name, _voter);
    }
    
}
