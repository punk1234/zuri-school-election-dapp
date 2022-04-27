import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
import { electionContext } from "../context/ViewElectionContext";
function Navbar() {
  const {
    getProviderContractOrSignerContract,
    walletConnected,
    connectWallet,
    address,
  } = useContext(providerSignerContext);
  const { activities } = useContext(electionContext);
  const { schoolName, setSchoolName } = useState("ZuriSchool");
  useEffect(() => {
    const viewSchoolName = async () => {
      try {
        // let contract = getProviderContractOrSignerContract()
        const contract = await getProviderContractOrSignerContract();
        let tx = await contract.schoolName();
        console.log(tx);
      } catch (err) {
        console.error(err.error);
      }
    };
    viewSchoolName();
  }, [walletConnected]);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body shadow-sm rounded">
      <div className="container">
        <Link className="navbar-brand" to={"/"}>
          {walletConnected ? "ZuriSchool" : "Home"}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNavAltMarkup"
        >
          {!walletConnected ? (
            <button
              onClick={connectWallet}
              class="btn btn-sm btn-outline-secondary "
              type="button"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="navbar-nav ">
              <Link
                className="nav-link active"
                aria-current="page"
                to={"/dashboard"}
              >
                Dashboad
              </Link>
              <div className="dropdown">
                <div
                  className="nav-link position-relative "
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i
                    className="bi bi-activity"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <span className="position-absolute translate-middle top-50">
                    {activities.length > 0 ? activities.length : "0"}
                  </span>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a class="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                </ul>
              </div>

              <Link className="nav-link" to={"/profile"}>
                Profile:
                {walletConnected &&
                  `${String(address).slice(0, 5)}..${String(address).slice(
                    -5
                  )}`}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
