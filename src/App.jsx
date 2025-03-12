import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [inputChainId, setInputChainId] = useState("");

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not detected!");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setChainId(await window.ethereum.request({ method: "eth_chainId" }));
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  // Switch to Existing Chain
  const switchChain = async () => {
    if (!window.ethereum) return alert("MetaMask not detected!");
    if (!inputChainId) return alert("Enter a valid Chain ID!");

    try {
      await window.ethereum.request({      
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${parseInt(inputChainId).toString(16)}` }],
      });
      setChainId(`0x${parseInt(inputChainId).toString(16)}`);
      alert("Switched to chain successfully!");
    } catch (error) {
      console.error("Error switching chain:", error);
      alert("You do not have this chain added in MetaMask!");
    }
  };

  // Send ETH to inputted recipient address
  const sendETH = async () => {
    if (!account) return alert("Connect your wallet first!");
    if (!recipient) return alert("Enter a valid Ethereum address!");

    try {
      const transactionHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: recipient,
            value: "0x" + (0.001 * 10 ** 18).toString(16),
          },
        ],
      });
      console.log("Transaction Hash:", transactionHash);
      alert("Transfer successful")
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transfer failed")
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts.length ? accounts[0] : null);
    };

    const handleChainChanged = (newChainId) => {
      setChainId(newChainId);
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <div className="wallet-container">
      <h2>Wallet Connect DApp (EIP-1193)</h2>

      {account ? (
        <div>
          <div className="wallet-info">
            <p>Connected: <span className="highlight">{account}</span></p>
            <p>Chain ID: <span className="highlight">{chainId}</span></p>
            <button className="disconnect-btn" onClick={disconnectWallet}>Disconnect</button>
          </div>

          <div className="send-eth">
            <h3>Send ETH</h3>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <button onClick={sendETH}>Send 0.001 ETH</button>
          </div>

          <div className="add-chain">
            <h3>Switch Ethereum Chain</h3>
            <input
              type="text"
              placeholder="Enter Chain ID"
              value={inputChainId}
              onChange={(e) => setInputChainId(e.target.value)}
            />
            <button onClick={switchChain}>Switch Chain</button>
          </div>
        </div>
      ) : (
        <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default App;
