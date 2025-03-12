import { useState, useEffect } from "react";

const Wallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  // Function to connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setChainId(await window.ethereum.request({ method: "eth_chainId" }));
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Function to disconnect (Clear state, but MetaMask doesn't support full disconnect)
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  useEffect(() => {
    if (!window.ethereum) return;
  
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };
  
    const handleChainChanged = (newChainId) => {
      setChainId(newChainId);
      window.location.reload(); // Reload the page for consistency
    };
  
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
  
    // Cleanup function to remove listeners when component unmounts
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);
  

  return (
    <div>
      {account ? (
        <div>
          <p>Connected: {account}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default Wallet;
