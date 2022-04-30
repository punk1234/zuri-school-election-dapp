// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

/** 
 * @title Zuri School Voting Access
 * @dev Manages voting process access & modifiers
 */
abstract contract VotingAccess {

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

    //@dev this defines a ballot struct which is used to store a single election instance
    struct Election {
        uint256 _id;
        uint256 num_choices;
        string name;
        string description;
        bool active;
        bool computed;
        uint256 startedAt;
        uint256 stoppedAt;
    }

    // @dev store the address of the chairperson
    address public chairperson;

    // @dev a mapping that maps the address of a voter to the voter struct
    mapping(address => Voter) public voters;

    // @dev a mapping that keeps track of an election id to the election struct
    mapping(uint256 => Election) public elections;

    /********************************************************************************************
     *** This section covers modifiers that control access for all the different stakeholders ***
     ********************************************************************************************/

    // @dev this is used to assert that the person calling a contract method is the chairperson
    modifier isChairperson(){
        require(msg.sender == chairperson, "only chairperson can perform this operation");
        _;
    }

    // @dev this is used to assert that the person calling the method is either a director or a teacher
    modifier isDirectorOrTeacher(){
        require(
            voters[msg.sender].userType == Stakeholder.DIRECTOR || voters[msg.sender].userType == Stakeholder.TEACHER, 
            "only directors and teachers can perform this operation"
        );
        _;
    }

    // modifier for checking eection
    modifier electionStatus(uint256 _electionId){
        if(elections[_electionId].stoppedAt == elections[_electionId].startedAt) {
            revert("election has not started");
        }
        
        require(elections[_electionId].stoppedAt >= block.timestamp, "election period has expired");
        require(elections[_electionId].active, "election must be active");
        require(!elections[_electionId].computed, "election result has already been computed");
        
        _;
    }

    // @dev this is used to assert that the person calling a contract method is a student
    // modifier isStudent() {
    //    require(voters[msg.sender].userType == Stakeholder.STUDENT, "only students can perform this operation");
    //    _;
    // }

    // @dev this is used to assert that the person calling a contract method is a teacher
    // modifier isTeacher(){
    //     require(voters[msg.sender].userType == Stakeholder.TEACHER, "only teachers can perform this operation");
    //     _;
    // }

    // @dev this is used to assert that the person calling a contract method is a director
    // modifier isDirector(){
    //     require(voters[msg.sender].userType == Stakeholder.DIRECTOR, "only director can perform this operation");
    //     _;
    // }

}
