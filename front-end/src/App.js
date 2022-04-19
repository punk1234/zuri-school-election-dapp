
import { useContext, useState } from "react";

import "./App.css";
import Navbar from "./components/Navbar";
import { providerSignerContext } from "./context/ProviderOrSignerContext";
function App() {
  const [loading, setLoading] = useState(false)
  const {
    getProviderContractOrSignerContract,
  } = useContext(providerSignerContext);
  

  ///sample code of how to use it
  const testing = async () => {
    //

    try {
      const providerContract = await getProviderContractOrSignerContract();
      
      setLoading(true)
      const tx = await  providerContract.roles("USER", "0xf4030DdD79fc7Fd49b25C976C5021D07568B4F91");
      // tx.wait() is only used for signer  
      setLoading(false)
      console.log(tx)
    } catch (err) {
      console.error(err);
      setLoading(false)
    }
  };

  const grantRole = async () => {
    try {
      const signerContract = await getProviderContractOrSignerContract(true);
      console.log(signerContract)
      setLoading(true)
      const tx = await  signerContract.grantRole("USER", "0xf4030DdD79fc7Fd49b25C976C5021D07568B4F91");
      
      setLoading(false)
      // listing for event 
      signerContract.on("GrantRole", (role, addr) => {
        console.log(role, addr)
      })
      console.log(tx)
    } catch (err) {
      console.error(err);
      setLoading(false)
    }
  };

  const revokeRole = async () => {
    try {
      const signerContract = await getProviderContractOrSignerContract(true);
     
      setLoading(true)
      const tx = await  signerContract.revokeRole("USER", "0xf4030DdD79fc7Fd49b25C976C5021D07568B4F91");
      // tx.wait() is only used for signer  
      setLoading(false)
      signerContract.on("GrantRole", (role, addr) => {
        console.log(role, addr)
      })
      console.log(tx)
    } catch (err) {
      console.error(err);
      setLoading(false)
    }
  };

  return (
    <div className="App">
      <Navbar />
      
      <button onClick={testing}>Check role</button>
      <button onClick={grantRole}>Grant role</button>
      <button onClick={revokeRole}>Revoke role</button>
      {loading && <p>loading...</p>}

      
    </div>
  );
}

export default App;
