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
        Stakeholder userType;
    }

    // @dev store the address of the chairperson
    address public chairperson;

    // @dev store the name of the school
    string public schoolName;

    // @dev keep track of all the registered voters on the contract
    address[] voterAddresses;

    // @dev a mapping that maps the address of a voter to the voter struct
    mapping(address => Voter) public voters;
    
    // @dev this is used to keep track of the weight of the votes of a specific user type
    mapping(Stakeholder => uint256) weights;

    // @dev this is used to assert that the person calling a contract method is a student
    modifier isStudent() {
       require(voters[msg.sender].userType == Stakeholder.STUDENT, "only students can perform this operation");
       _;
    }

    // @dev this is used to assert that the person calling a contract method is the chairperson
    modifier isChairperson() {
        require(msg.sender == chairperson, "only chairperson can perform this operation");
        _;
    }

    // @dev for all the various events carried out on the contract
    event StudentCreated(string name, address _student);
    event DirectorCreated(string name, address _director);

    /**
     * @notice setup voting smart contract defaults
     * @dev setup chairperson, stakeholders vote weights & school name
     * @param _schoolName name of school that owns the contract
     */
    constructor(string memory _schoolName) {
        chairperson = msg.sender;
        schoolName = _schoolName;

        _initializeStakeholdersVoteWeight(1);

        // create director voter for chairperson
        Voter memory _voter = Voter("chairperson", true, Stakeholder.DIRECTOR);
        _addVoter(msg.sender, _voter);

        emit DirectorCreated("chairperson", msg.sender);
    }

    /**
     * @notice check if address belongs to chairperson
     * @dev check if address matches stored chairperson address
     * @param _chairperson address to verify if belongs to chairperson
     * @return bool
     */
    function iamChairperson(address _chairperson) external view returns(bool){
        if(chairperson == _chairperson) { return true; }

        return false;
    }

    /**
     * @notice add a student voter to the system
     * @dev add a student voter to the system
     * @param _name name of the student
     * @param _student student wallet address
     */
    function addStudent(string memory _name, address _student) external isChairperson {
        Voter memory _voter = Voter(_name, true, Stakeholder.STUDENT);
        _addVoter(_student, _voter);

        emit StudentCreated(_name, _student);
    }

    /**
     * @notice check if address has been registered to vote
     * @dev check if address is in the list of voter addresses
     * @param _voter voter address or identifier
     * @return bool
     */
    function _isVoter(address _voter) private view returns(bool) {
        for(uint256 i = 0; i < voterAddresses.length; i++) {
            if(voterAddresses[i] == _voter) { return true; }
        }

        return false;
    }

    /**
     * @notice add a voter to the system
     * @dev add an address to our list of voters on the contract
     * @param _voter voter wallet address
     * @param _voterData voter information including name, canVote & userType
     */
    function _addVoter(address _voter, Voter memory _voterData) private {
        if (!_isVoter(_voter)) {
            voterAddresses.push(_voter);
            voters[_voter] = _voterData;
        }
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
    
}