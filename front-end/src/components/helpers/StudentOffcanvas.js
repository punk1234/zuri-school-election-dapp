import React, { useContext } from "react";
import { electionContext } from "../../context/ViewElectionContext";

export default function StudentOffcanvas() {
  const { banVoter, unbanVoter, allAddress, addStudent, addTeacher } =
    useContext(electionContext);

  const displayAddress = allAddress.map((address) => {
    <div key={address}>
      <ul>
        <li>{`${String(address).slice(0, 5)}..${String(address).slice(
          -5
        )}`}</li>
      </ul>
    </div>;
  });
  return (
    <>
      <button
        className="btn btn-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        All Users
      </button>
      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
            All Users
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">{displayAddress}</div>
      </div>
    </>
  );
}
