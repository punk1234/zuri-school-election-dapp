// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Events.sol";
import "./UserManager.sol";

/** 
 * @title Zuri School Voting
 * @dev Implements voting process along with vote delegation
 */
contract ZuriSchoolVoting is VotingEvents, UserManager {
    
    //@dev this is a proposal on the contract, a proposal is simply an option in an election
    struct Proposal {
        string name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    // @dev this is used to keep track of the count of elections
    uint256 public electionCount = 0;

    // @dev store the name of the school
    string public schoolName;

    // @dev this is a mapping of mappings used to keep track of if a voter has voted in an election already
    mapping(uint256 => mapping(address=>bool)) hasVoted;

    // @dev this is used to keep track of the weight of the votes of a specific user type
    mapping(Stakeholder => uint256) weights;

    // @dev this is used to keep track of the timers for the various elections
    mapping(uint256 => uint256) timers;

    // @dev this is used to keep track of the winnig proposal for each election
    mapping(uint256 => Proposal) winners;
    
    // @dev this is a mapping to track the choices for various elections
    mapping(uint256 => Proposal[]) choices;

    /**
     * @notice setup voting smart contract defaults
     * @dev setup chairperson, stakeholders vote weights & school name
     * @param _schoolName name of school that owns the contract
     */
    constructor(string memory _schoolName, address _chairperson) {
        schoolName = _schoolName;
        chairperson = _chairperson;

        _initializeStakeholdersVoteWeight(1);

        // create director voter for chairperson
        // Voter memory _voter = Voter("chairperson", true, Stakeholder.DIRECTOR);
        // _addVoter(msg.sender, _voter);
        addDirector("chairperson", _chairperson);

        emit DirectorCreated("chairperson", _chairperson);
    }

    /**
     * @notice change current chairman to a different user
     * @dev set chairperson variable with a different user
     * @param _newChairman address of new chairman
     */
    function changeChairmanship(address _newChairman) external isChairperson returns(bool) {
        require(chairperson != _newChairman, "new chairman must be a different user");

        chairperson = _newChairman;
        emit ChairmanChanged("chairman", _newChairman);

        return true;
    }

    /**
     * @notice check if address belongs to chairperson
     * @dev check if address matches stored chairperson address
     * @param _chairperson address to verify if belongs to chairperson
     * @return bool
     */
    function iamChairperson(address _chairperson) external view returns(bool) {
        if(chairperson == _chairperson) { return true; }

        return false;
    }

    /**
     * @notice set stakeholders initial vote weight
     * @dev initialize stakeholders vote weight
     * @param _weight vote weight
     */
    function _initializeStakeholdersVoteWeight(uint _weight) private {
        weights[Stakeholder.STUDENT] = _weight;
        weights[Stakeholder.TEACHER] = _weight;
        weights[Stakeholder.DIRECTOR] = _weight;
    }

    // @function that returns details about a user whose address is passed todo @KC
    function whoami(address _voter) external view returns(string memory name, string memory usertype, bool canVote){
        string memory _userType = "student";

        if(voters[_voter].userType == Stakeholder.TEACHER) {
            _userType = "teacher";
        }
        else if(voters[_voter].userType == Stakeholder.DIRECTOR) {
            _userType = "director";
        }

        return (voters[_voter].name, _userType, voters[_voter].canVote);
    }

    // @dev this function is used for creating an election either by a teacher or director
    function createElection(
        string memory _name, 
        string memory _description, 
        string[] calldata _choices,
        uint256 numHours
    ) external isDirectorOrTeacher {

       require(_choices.length > 1, "choice must be 2 at list");
        uint256 _num_choices = _choices.length;
        uint _id = electionCount;
        uint expirationTime = numHours * (60*60);

        Election memory _election = Election(_id, _num_choices, _name, _description, false, false, 0, 0);
        for (uint256 i = 0; i < _num_choices; i++) {
            Proposal memory _proposal = Proposal(_choices[i], 0);
            choices[_id].push(_proposal);
        }

        timers[electionCount] = expirationTime;
        elections[_id] = _election;
        electionCount++;
        
        emit BallotCreated(_id, _name, expirationTime);
    }

    // @dev this function is used to cast the vote of an election
    function castVote(uint256 _electionId, uint256 _proposalIndex) external electionStatus(_electionId) {
        require(voters[msg.sender].canVote == true, "you must be allowed to vote to perform this operation");
        require(hasVoted[_electionId][msg.sender] == false, "you have already voted for this election");

        // cast a vote based on the weight of that specific user type
        choices[_electionId][_proposalIndex].voteCount += weights[voters[msg.sender].userType];
        hasVoted[_electionId][msg.sender] = true;

        emit VoteCasted(_electionId, msg.sender);
    }

    //function to return the time remaining for each election
    function electionTimeLeft(uint256 _electionId) external view electionStatus(_electionId) returns(uint256){
        uint256 timeLeft = elections[_electionId].stoppedAt - block.timestamp; 

        return timeLeft;
    }

    // @function used to start an election. should only be called by chairperson todo @cptMoh
    function startElection(uint256 _electionId) external isChairperson {
        require(!elections[_electionId].active, "already started election cannot be started again");
        require(!elections[_electionId].computed, "election result has already been computed");
        elections[_electionId].active = true;
        elections[_electionId].startedAt = block.timestamp;
        elections[_electionId].stoppedAt = timers[_electionId] + block.timestamp;
        emit BallotStarted(_electionId, elections[_electionId].name, block.timestamp);
    }

    // @dev this is a function to stop an election
    function stopElection(uint256 _electionId) public isChairperson electionStatus(_electionId) {
        elections[_electionId].active = false;
        elections[_electionId].stoppedAt = block.timestamp;
        timers[_electionId] = block.timestamp;

        emit BallotStopped(_electionId, elections[_electionId].name, block.timestamp);
    }

    /**
     * @notice view the details of an election
     * @dev view election detailsl
     * @param _electionId the id of the election you want to view its details
     */
    function viewElection(uint256 _electionId) external view returns(
        string memory name, 
        string[] memory props, 
        bool isActive, 
        bool isComputed,
        uint256 startedAt,
        uint256 stoppedAt

    ) {
        string[] memory proposals = new string[](choices[_electionId].length);
        for(uint256 i=0; i < choices[_electionId].length; i++) {
            proposals[i] = choices[_electionId][i].name;
        } 
        return (
            elections[_electionId].name, 
            proposals, 
            elections[_electionId].active, 
            elections[_electionId].computed,
            elections[_electionId].startedAt,
            elections[_electionId].stoppedAt
        );
    }

    /**
     * @notice view the stats of an ongoing or completed election
     * @dev view election statistics
     * @param _electionId the id of the election you want to view the statistics of
     */
    function viewElectionStats(uint256 _electionId) external view returns(
        string[] memory names, 
        string[] memory user_types, 
        bool[] memory canVotes, 
        bool[] memory hasVoteds
    ) {
        string[] memory _names = new string[](voterAddresses.length);
        bool[] memory _canVotes = new bool[](voterAddresses.length);
        bool[] memory _hasVoteds = new bool[](voterAddresses.length);
        string[] memory _user_types = new string[](voterAddresses.length);

        for(uint256 i = 0; i < voterAddresses.length; i++){
            _names[i] = voters[voterAddresses[i]].name;
            string memory _user_type = "";

            if(voters[voterAddresses[i]].userType == Stakeholder.STUDENT) {
                _user_type = "student";
            } else if (voters[voterAddresses[i]].userType == Stakeholder.TEACHER) {
                _user_type = "teacher";
            } else {
                _user_type = "director";
            }

            _user_types[i] = _user_type;
            _canVotes[i] = voters[voterAddresses[i]].canVote;
            _hasVoteds[i] = hasVoted[_electionId][voterAddresses[i]];
        }
        
        return (_names, _user_types, _canVotes, _hasVoteds);
    }

    /**
     * @notice compile the results of an election, the election is automatically stopped when the result is compiled
     * @dev compile election results
     * @param _electionId the id of the election you want to compile the results for
     */
    function compileResults(uint256 _electionId) external isDirectorOrTeacher {
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

    /**
     * @notice view the results of a completed election
     * @dev view results of an election
     * @param _electionId the id of the election you want to view the results for
     */
    function viewResult(uint256 _electionId) external view returns(
        string memory electionName, 
        string memory proposalName, 
        uint256 voteCount
    ) {
        require(elections[_electionId].computed == true, "results have not yet been compiled");
        return (elections[_electionId].name, winners[_electionId].name, winners[_electionId].voteCount);
    }

    /**
     * @notice manually set the weights for a particular voter type
     * @dev adjust voter type vote weights
     * @param stakeholder is the name of the voter type you want to set the weights for
     * @param weight is the value you want to set the weight to
     */
    function setWeight(string memory stakeholder, uint256 weight) external isChairperson {
        require(weight > 0 && weight <= 10, "weights can only take values 1 to 10");

        if(_stringsEquals(stakeholder,"student")) {
            weights[Stakeholder.STUDENT] = weight;
        } 
        else if(_stringsEquals(stakeholder,"teacher")) {
            weights[Stakeholder.TEACHER] = weight;
        } 
        else if(_stringsEquals(stakeholder,"director")) {
            weights[Stakeholder.DIRECTOR]  = weight;
        }
        else {
            revert("invalid stakeholder name entered");
        }
    }

    /**
     * @notice get the weights for a particular voter type
     * @dev adjust voter type vote weights
     * @param stakeholder is the name of the voter type you want to get the weights for
     */
    function getWeight(string memory stakeholder) external view isChairperson returns(uint256) {
        if(_stringsEquals(stakeholder,"student")) {
            return weights[Stakeholder.STUDENT];
        }
        else if(_stringsEquals(stakeholder,"teacher")) {
            return weights[Stakeholder.TEACHER];
        }
        else if(_stringsEquals(stakeholder,"director")) {
            return weights[Stakeholder.DIRECTOR];
        }
        
        revert("invalid stakeholder name entered");
    }

    /**
     * @notice ban a voter from participating in elections
     * @dev ban a voter from voting
     * @param _voter the voter's wallet address
     */
    function banVoter(address _voter) external isChairperson {
        require(voters[_voter].canVote, "user has already been banned");

        voters[_voter].canVote = false;
        emit BanVoter(voters[_voter].name, _voter);
    }

    /**
     * @notice unban a voter from participating in elections
     * @dev unban a voter from voting
     * @param _voter the voter's wallet address
     */
    function unbanVoter(address _voter) external isChairperson {
        require(!voters[_voter].canVote, "user is not banned");

        voters[_voter].canVote = true;
        emit UnbanVoter(voters[_voter].name, _voter);
    }

    // @function used to check if two strings are equal
    function _stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
        bytes memory b1 = bytes(s1);
        bytes memory b2 = bytes(s2);

        uint256 l1 = b1.length;
        if (b1.length != b2.length) return false;

        for (uint256 i = 0; i < l1; i++) {
            if (b1[i] != b2[i]) return false;
        }

        return true;
    }

}
