// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
/** 
 * @title Zuri School Voting
 * @dev Implements voting process along with vote delegation
 */


 contract ZuriSchoolVoting {

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

    


    /**
        This section covers modifiers that control access for all the different stakeholders
     */


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

    // @dev this is used to assert that the person calling the method is either a director or a teacher
    modifier isDirectorOrTeacher(){
        require(voters[msg.sender].user_type == Stakeholder.DIRECTOR || voters[msg.sender].user_type == Stakeholder.TEACHER, "only directors and teachers can perform this operation");
        _;
    }


    // @setup for all the various events carried out on the contract. All events are declared here.
    event DirectorCreated(string name, address _director);
     event StudentCreated(string name, address _student);
    event TeacherCreated(string name, address _teacher);
    event DirectorCreated(string name, address _director);




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

    // @function used to check if two strings are equal  todo @Fatai



    // @function to check if address is in the list of voter addresses todo @Fatai



    // @function used to add an address to our list of voters on the contract todo @Fatai



    // @function used to check if an address is a chairperson todo @Fatai



    // @function that returns details about a user whose address is passed todo @KC
    function whoami(address _voter) public view returns(string memory name, string memory usertype, bool canVote){
        string memory _usertype = "student";
        if(voters[_voter].user_type == Stakeholder.TEACHER){
            _usertype = "teacher";
        } else if(voters[_voter].user_type == Stakeholder.DIRECTOR){
            _usertype = "director";
        }

        return (voters[_voter].name, _usertype, voters[_voter].canVote);
    }



    // @function that is used to create a student voter todo @KC
 function addStudent(string memory _name, address _student) public isChairperson {
        Voter memory _voter = Voter(_name, true, Stakeholder.STUDENT);
        voters[_student]  = _voter;
        addVoter(_student);
        emit StudentCreated(_name, _student);
    }


    // @function that is used to create a teacher voter todo @KC
 function addTeacher(string memory _name, address _teacher) public isChairperson {
        Voter memory _voter = Voter(_name, true, Stakeholder.TEACHER);
        voters[_teacher]  = _voter;
        addVoter(_teacher);
        emit TeacherCreated(_name, _teacher);
    }


    // @function that is used to create a director voter todo @KC
 function addDirector(string memory _name, address _director) public isChairperson {
        Voter memory _voter = Voter(_name, true, Stakeholder.DIRECTOR);
        voters[_director]  = _voter;
        addVoter(_director);
        emit DirectorCreated(_name, _director);
    }


    // @function that is used for creating an election either by a teacher or director todo @cptMoh



    // @function that is used to cast the vote of an election todo @cptMoh



    // @function used to start an election. should only be called by chairperson todo @cptMoh




    // @function used to stop an election. should only be called by chairpairson todo @cptMoh




    // @function to get details about an election by providing its id todo @Kosi




    // @function to view the statistics of a particular election todo @Kosi



    // @function used to compile results of an election. should only be called by a director or teacher todo @Kosi



    // @function used to view results of an election by taking in the election id. should require the results to have been computed todo @Kosi



    // @function used to customize the vote weight for the various stakeholders todo @Kosi



    // @function used to ban a voter from voting on the contract todo @Kosi




    // @function used to unban a voter from voting on the contract todo @Kosi



}

