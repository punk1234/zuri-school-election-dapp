// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ZuriElection {



// @setup for all the various events carried out on the contract


    event StudentCreated(string name, address _student);
    event TeacherCreated(string name, address _teacher);
    event DirectorCreated(string name, address _director);



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

}