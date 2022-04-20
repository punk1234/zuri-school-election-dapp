import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
function Navbar() {
  const { walletConnected, connectWallet, address } = useContext(
    providerSignerContext
  );
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{"z-index": "2000;"}}>
      <div className="container">
        <Link className="navbar-brand" to={"/"}>
          DashBoard
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
              <Link className="nav-link active" aria-current="page" to={"/"}>
                Home
              </Link>
              <Link className="nav-link" to={"/profile"}>
                Profile:
                {walletConnected &&
                  `${String(address).slice(0, 5)}..${String(address).slice(-5)}`}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
