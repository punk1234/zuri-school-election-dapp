// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

/** 
 * @title Zuri School Voting Events
 * @dev Manages voting process events
 */
abstract contract VotingEvents {

    // @setup for all the various events carried out on the contract. All events are declared here.

    event StudentCreated(string name, address _student);
    event TeacherCreated(string name, address _teacher);
    event DirectorCreated(string name, address _director);

    event BallotStarted(uint256 _id, string name, uint256 time);
    event BallotStopped(uint256 _id, string name, uint256 time);

    event BallotCreated(uint256 _id, string name, uint256 time);
    event BallotResultCompiled(uint256 _id, string name, uint256 time);

    event VoteCasted(uint256 _electionId, address _voter);
    
    event BanVoter(string name, address _voter);
    event UnbanVoter(string name, address _voter);

    event ChairmanChanged(string name, address _chairman);

}
