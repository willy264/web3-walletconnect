import { useState, useEffect } from "react";
import "./App.css"; 

const App = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [chainData, setChainData] = useState({
    chainId: "",
    chainName: "",
    rpcUrl: "",
    currencyName: "",
    currencySymbol: "",
    currencyDecimals: 18,
    explorerUrl: "",
  });

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }
  
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
  
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(chain);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  // Handle input changes for adding a new chain
  const handleChainInputChange = (e) => {
    setChainData({ ...chainData, [e.target.name]: e.target.value });
  };

  // Add a new Ethereum chain
  const addCustomChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${parseInt(chainData.chainId).toString(16)}`,
            chainName: chainData.chainName,
            rpcUrls: [chainData.rpcUrl],
            nativeCurrency: {
              name: chainData.currencyName,
              symbol: chainData.currencySymbol,
              decimals: Number(chainData.currencyDecimals),
            },
            blockExplorerUrls: [chainData.explorerUrl],
          },
        ],
      });
      alert("Chain added successfully!");
    } catch (error) {
      console.error("Error adding network:", error);
      alert("Failed to add chain.");
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
            value: "0x" + (0.01 * 10 ** 18).toString(16),
          },
        ],
      });
      console.log("Transaction Hash:", transactionHash);
    } catch (error) {
      console.error("Transaction failed:", error);
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
            <button onClick={sendETH}>Send 0.01 ETH</button>        
          </div>

          <div className="add-chain">
            <h3>Add Custom Ethereum Chain</h3>
            <input type="text" name="chainId" placeholder="Chain ID" onChange={handleChainInputChange} />
            <input type="text" name="chainName" placeholder="Chain Name" onChange={handleChainInputChange} />
            <input type="text" name="rpcUrl" placeholder="RPC URL" onChange={handleChainInputChange} />
            <input type="text" name="currencyName" placeholder="Currency Name" onChange={handleChainInputChange} />
            <input type="text" name="currencySymbol" placeholder="Currency Symbol" onChange={handleChainInputChange} />
            <input type="text" name="currencyDecimals" placeholder="Decimals" onChange={handleChainInputChange} />
            <input type="text" name="explorerUrl" placeholder="Block Explorer URL" onChange={handleChainInputChange} />
            <button onClick={addCustomChain}>Add Chain</button>        
          </div>
        </div>
      ) : (
        <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default App;
