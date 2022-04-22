import { useContext, useState } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
import Election from "./helpers/Election"
export default function Admin() {
  const { getProviderContractOrSignerContract } = useContext(
    providerSignerContext
  );

  const [loading, setLoading] = useState(false);
  const [directorDetails, setDirectorDetails] = useState({});
  const [teacherDetails, setTeacherDetails] = useState({});
  const [studentDetails, setStudentDetails] = useState({});
  const [weight, setWeight] = useState({});
  //handle]ing directors
  const handleDirector = async (event) => {
    event.preventDefault();
    console.log(directorDetails);
    try {
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      setLoading(true);
      const tx = await contract.addDirector(
        directorDetails.name,
        directorDetails.address
      );
      tx.wait();
      setLoading(false);
      console.log(tx);
      contract.on("DirectorCreated", (dName, address) => {
        console.log(
          `a director with name: ${dName} and address ${address} is created`
        );
      });
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }

      setLoading(false);
    }
  };
  const handleDirectorInputs = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDirectorDetails((preState) => {
      return { ...preState, [name]: value };
    });
  };

  //teacher sections
  const handleTeacher = async (event) => {
    event.preventDefault();
    console.log(teacherDetails);
    try {
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      setLoading(true);
      const tx = await contract.addTeacher(
        teacherDetails.name,
        teacherDetails.address
      );
      tx.wait();
      setLoading(false);
      console.log(tx);
      contract.on("TeacherCreated", (Tname, address) => {
        console.log(
          `a director with name: ${Tname} and address ${address} is created`
        );
      });
    } catch (err) {
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }

      setLoading(false);
    }
  };
  const handleTeacherInputs = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setTeacherDetails((preState) => {
      return { ...preState, [name]: value };
    });
  };

  //student sections
  const handleStudent = async (event) => {
    event.preventDefault();
    console.log(studentDetails);
    try {
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      setLoading(true);
      const tx = await contract.addStudent(
        studentDetails.name,
        studentDetails.address
      );
      tx.wait();
      setLoading(false);
      console.log(tx);
      contract.on("StudentCreated", (Sname, address) => {
        console.log(
          `a director with name: ${Sname} and address ${address} is created`
        );
      });
    } catch (err) {
      setLoading(false);
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error);
      }
    }
  };
  const handleStudentInputs = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setStudentDetails((preState) => {
      return { ...preState, [name]: value };
    });
  };

  // setweight
  const handleWeight = async (event) => {
    event.preventDefault();
    console.log(weight);
    try {
      const contract = await getProviderContractOrSignerContract(true);
      console.log(contract);
      setLoading(true);
      const tx = await contract.setWeight(weight.stakeHolder, weight.number);
      tx.wait();
      setLoading(false);
      console.log(tx);
    } catch (err) {
      setLoading(false);
      if (err.error === undefined) {
        console.log("not connected");
      } else {
        console.error(err.error.message);
      }
    }
  };
  const handleWeightInputs = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setWeight((preState) => {
      return { ...preState, [name]: value };
    });
  };

  return (
    <div className="container row my-5">
      <div className="col-4">
      <h2>Chairman</h2>
      <div className="my-4">
        Add Director
        <form onSubmit={handleDirector}>
          <label>Name: </label>
          <input
            type="text"
            placeholder="name"
            required
            name="name"
            onChange={handleDirectorInputs}
            value={directorDetails.name || ""}
          />

          <label>Address: </label>
          <input
            type="text"
            name="address"
            placeholder="address"
            required
            onChange={handleDirectorInputs}
            value={directorDetails.address || ""}
          />
          <button type="submit">Add Director</button>
        </form>
      </div>
      {/* teacher  */}
      <div className="my-4">
        Add Teacher
        <form onSubmit={handleTeacher}>
          <label>Name: </label>
          <input
            type="text"
            placeholder="name"
            name="name"
            required
            onChange={handleTeacherInputs}
            value={teacherDetails.name || ""}
          />

          <label>Address: </label>
          <input
            type="text"
            name="address"
            placeholder="address"
            required
            onChange={handleTeacherInputs}
            value={teacherDetails.address || ""}
          />
          <button type="submit">Add Teacher</button>
        </form>
      </div>
      {/* student section  */}
      <div className="my-4">
        Add Student
        <form onSubmit={handleStudent}>
          <label>Name: </label>
          <input
            type="text"
            placeholder="name"
            required
            name="name"
            onChange={handleStudentInputs}
            value={studentDetails.name || ""}
          />

          <label>Address: </label>
          <input
            type="text"
            name="address"
            placeholder="address"
            required
            onChange={handleStudentInputs}
            value={studentDetails.address || ""}
          />
          <button type="submit">Add Student</button>
        </form>
      </div>
      {/* set weight  */}
      <div className="my-4">
        Set Weight
        <form onSubmit={handleWeight}>
          <label>Stake holder: </label>
          <select
            value={weight.stakeHolder || ""}
            onChange={handleWeightInputs}
            name="stakeHolder"
          >
            <option value="">-select a stake holder-</option>
            <option value="student">student</option>
            <option value="teacher">teacher</option>
            <option value="director">director</option>
          </select>

          <label>Weight: </label>

          <input
            type="number"
            name="number"
            placeholder="weight"
            required
            onChange={handleWeightInputs}
            value={weight.number || ""}
          />
          <button type="submit">set weight</button>
        </form>
      </div>

      </div>
    {/* section for showing election   */}
    <div className="col-8">
     <Election />
    </div>
    </div>
  );
}
