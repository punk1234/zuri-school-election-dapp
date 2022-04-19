import React, { useContext } from "react";
import { providerSignerContext } from "../context/ProviderOrSignerContext";
function Navbar() {
  const { walletConnected, connectWallet, address } = useContext(
    providerSignerContext
  );
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="3">
          DashBoard
        </a>

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
              <a className="nav-link active" aria-current="page" href="3">
                Home
              </a>
              <a className="nav-link" href="3">
                Features
              </a>
              <a className="nav-link" href="3">
                Profile:
                {walletConnected &&
                  `${String(address).slice(0, 5)}..${String(address).slice(-5)}`}
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
