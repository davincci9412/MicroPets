import { useCallback } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { useWeb3 } from "../services/web3";
import jsonData from './data.json';

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        56: "https://bsc-dataseed.binance.org/",
        //42: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      },
    },
  },
  metamask: {
    id: "injected",
    name: "MetaMask",
    type: "injected",
    check: "isMetaMask",
  },
};

function Connect() {
  const {
    connected,
    setConnected,
    account,
    setAccount,
    setProvider,
    setWeb3,
    chainId,
    setChainId,
    setError,
    reset,
    disconnect,
  } = useWeb3();

  const modal = new Web3Modal({
    network: "binance",
    providerOptions,
  });

  const connectProvider = useCallback(
    (provider) => {
      console.log("[Web3] Setting up provider");
      const web3 = new Web3(provider);
      Promise.all([
        web3.eth.net.getId().then((net) => setChainId(net.chainId)),
        web3.eth.getAccounts().then(([account]) => setAccount(account)),
      ]).then(() => setWeb3(web3));
    },
    [setWeb3, setChainId, setAccount]
  );

  const connect = useCallback(() => {
    modal
      .connect()
      .then((provider) => {
        provider.on("accountsChanged", ([account]) => {
          console.log("[Web3] accountsChanged");
          const loadData = JSON.parse(JSON.stringify(jsonData));
          if (account !== undefined) {
            if (account.toLowerCase() === loadData[0].address.toLowerCase()) {
              document.getElementById("admin").classList.remove("no-show");
            }
          };
          setAccount(account);
          connectProvider(provider);
        });

        provider.on("chainChanged", (chainId) => {
          console.log("[Web3] chainChanged");
          setChainId(parseInt(chainId, 16));
          connectProvider(provider);
        });

        provider.on("connect", ({ chainId }) => {
          console.log("[Web3] Connect");
          setConnected(true);
          setChainId(chainId);
          setError(undefined);
          connectProvider(provider);
        });

        provider.on("disconnect", (error) => {
          console.log("[Web3] Disconnect");
          setConnected(false);
          setAccount();
          reset(error);
          console.log(error);
        });

        setProvider(provider);
        setConnected(true);
        connectProvider(provider);
      })
      .catch((error) => console.error(error));
  });

  const deactivate = useCallback(() => {
    disconnect();
    reset();
  }, [disconnect, reset]);

  if (connected) {
    return (
      <div onClick={deactivate} className="btn btn-red">Disconnect Wallet</div>
    );
  }

  return (
    <div id="connect-button" onClick={connect} className="btn btn-red">Connect Wallet</div>
  );
}

export default Connect;
