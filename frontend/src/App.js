import { useState } from "react";
import { ethers } from "ethers";
import CoinflipABI from "./Coinflip.json";
import "./App.css";

const CONTRACT_ADDRESS = "0x82a7bfB9430103506AfCdc70C36666377aC24c54";

function App() {
  const [account, setAccount] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [result, setResult] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setResult("Wallet connected!");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setResult("Failed to connect wallet: " + error.message);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const flipCoin = async () => {
    if (!account) {
      alert("Please connect wallet!");
      return;
    }
    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
      alert("Please enter a valid bet amount (e.g., 0.01 ETH)!");
      return;
    }
    const betInEth = parseFloat(betAmount);
    if (betInEth < 0.01 || betInEth > 1) {
      alert("Bet must be between 0.01 and 1 ETH!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CoinflipABI.abi,
        signer
      );
      const tx = await contract.flip({
        value: ethers.parseEther(betAmount),
        gasLimit: 100000,
      });
      setResult("Flipping... Waiting for transaction confirmation...");
      const receipt = await tx.wait();
      const flipEvent = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((log) => log && log.name === "Flip");
      if (flipEvent) {
        const { result, payout } = flipEvent.args;
        setResult(
          result
            ? `You won! Payout: ${ethers.formatEther(payout)} ETH`
            : "You lost!"
        );
      } else {
        setResult("Flip complete, but no event found. Check your wallet.");
      }
    } catch (error) {
      console.error("Error flipping coin:", error);
      setResult("Error: " + (error.reason || error.message || "Transaction failed"));
    }
  };

  return (
    <div className="App">
      <h1>Coinflip DApp on Tea Sepolia</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {account}</p>
      )}
      <div>
        <input
          type="text"
          placeholder="Bet amount in ETH (e.g., 0.01)"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <button onClick={flipCoin} disabled={!account}>
          Flip Coin
        </button>
      </div>
      {result && <p>{result}</p>}
    </div>
  );
}

export default App;