// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Events.sol";
import "./VotingAccess.sol";
import "./Events.sol";

/** 
 * @title Zuri School Voting
 * @dev Implements voting user management
 */
abstract contract UserManager is VotingAccess, VotingEvents {

    // @dev keep track of all the registered voters on the contract
    address[] voterAddresses;

    /**
     * @notice add a student voter to the system
     * @dev add a student voter to the system
     * @param _name name of the student
     * @param _student student wallet address
     */
    function addStudent(string memory _name, address _student) external isChairperson {
        require(bytes(_name).length > 0, "student name is not valid");
        require(bytes(voters[_student].name).length == 0, "student already exist");

        Voter memory _voter = Voter(_name, true, Stakeholder.STUDENT);
        _addVoter(_student, _voter);

        emit StudentCreated(_name, _student);
    }

    // @function that is used to create a teacher voter
    function addTeacher(string memory _name, address _teacher) external isChairperson {
        require(bytes(_name).length > 0, "teacher name is not valid");
        require(bytes(voters[_teacher].name).length == 0, "teacher already exist");

        Voter memory _voter = Voter(_name, true, Stakeholder.TEACHER);
        _addVoter(_teacher, _voter);

        emit TeacherCreated(_name, _teacher);
    }

    // @function that is used to create a director voter
    function addDirector(string memory _name, address _director) public isChairperson {
        require(bytes(_name).length > 0, "director name is not valid");
        require(bytes(voters[_director].name).length == 0, "director already exist");

        Voter memory _voter = Voter(_name, true, Stakeholder.DIRECTOR);
        _addVoter(_director, _voter);

        emit DirectorCreated(_name, _director);
    }

    /**
     * @notice add students to the system
     * @dev add students to the system from a list of addresses and names
    */
    function addStudents(address[] memory _students, string[] memory _names) external isChairperson {
        require(_names.length > 0, "0 names");
        require(_students.length > 0, "0 addresses");
        require(_students.length == _names.length, "names != addresses");

        for(uint256 i = 0; i < _students.length; i++) {
            require(bytes(voters[_students[i]].name).length == 0, "student already exist");
            Voter memory _voter = Voter(_names[i], true, Stakeholder.STUDENT);
            _addVoter(_students[i], _voter);
        }       
    }
    
    /**
     * @notice add teachers to the system
     * @dev add teachers to the system from a list of addresses and names
     */
    function addTeachers(address[] memory _teachers, string[] memory _names) external isChairperson {
        require(_names.length > 0, "0 names");
        require(_teachers.length > 0, "0 addresses");
        require(_teachers.length == _names.length, "names != addresses");

        for(uint256 i = 0; i < _teachers.length; i++) {
            require(bytes(voters[_teachers[i]].name).length == 0, "teacher already exist");
            Voter memory _voter = Voter(_names[i], true, Stakeholder.TEACHER);
            _addVoter(_teachers[i], _voter);
        }
    }

    /**
     * @notice add directors to the system
     * @dev add directors to the system from a list of addresses and names
     */
    function addDirectors(address[] memory _directors, string[] memory _names) external isChairperson {
        require(_names.length > 0, "0 names");
        require(_directors.length > 0, "0 addresses");
        require(_directors.length == _names.length, "names != addresses");

        for(uint256 i = 0; i < _directors.length; i++) {
            require(bytes(voters[_directors[i]].name).length == 0, "director already exist");
            Voter memory _voter = Voter(_names[i], true, Stakeholder.DIRECTOR);
            _addVoter(_directors[i], _voter);
        }
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

}
