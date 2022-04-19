import { createContext,  useRef, useState  } from "react";
import { providers, Contract } from "ethers";
import Web3Modal from "web3modal";
import {abi, CONTRACT_ADDRESS} from "../constants/index"


export const providerSignerContext = createContext()
export default function ProviderOrSignerContext(props) {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState(null)
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  //to get signer or provider
  const getProviderContractOrSignerContract = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const addr = await web3Provider.listAccounts()
    setAddress(addr[0])
    const web3ProviderContract = new Contract(CONTRACT_ADDRESS, abi, web3Provider)

    // If user is not connected to the Rinkeby network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      const signerContract = new Contract(CONTRACT_ADDRESS, abi, signer)
     
      // return signer;
      return signerContract
    }
    // return web3Provider;
    return web3ProviderContract
  };

 
  /*
    connectWallet: Connects the MetaMask wallet
  */
    const connectWallet = async () => {
      if (!walletConnected) {
        // Assign the Web3Modal class to the reference object by setting it's `current` value
        // The `current` value is persisted throughout as long as this page is open
        web3ModalRef.current = new Web3Modal({
          network: "rinkeby",
          providerOptions: {},
          disableInjectedProvider: false,
        });
      }
        try {
          
          // Get the provider from web3Modal, which in our case is MetaMask
          // When used for the first time, it prompts the user to connect their wallet
          await getProviderContractOrSignerContract();
          setWalletConnected(true);
    
        } catch (err) {
          console.error(err);
        }
      };
    

     
    return (
        <providerSignerContext.Provider value={{ walletConnected, connectWallet, address, getProviderContractOrSignerContract}}>
            {props.children}
        </providerSignerContext.Provider>
    )

}