# Layer2 Lab — Web3 Website

A 4-page Web3 learning website built with HTML, CSS, and JavaScript.

## Pages

- **Home / Landing** (`index.html`)
  - Arbitrum and Layer 2 overview with hero, features, and educational sections.
- **Concepts** (`concepts.html`)
  - Visual comparison cards for Web2 vs Web3, Ethereum vs Bitcoin, Public Key vs Private Key, and Blockchain vs Traditional Databases.
- **Live Prices** (`prices.html`)
  - Live crypto dashboard fetching real-time ETH and BTC prices from the CoinGecko API.
- **Block Simulator** (`simulator.html`)
  - Interactive proof-of-work simulator showing hashing, nonce mining, and how changing block data breaks a chain.

## Run locally

1. Open the project folder in VS Code.
2. Use Live Server or any static file server.

### Option 1: Open directly
- Open `index.html` in the browser.

### Option 2: Use Python server
```powershell
cd c:\Users\Haresh\Web3_rust_workshop
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Notes

- CoinGecko API is used to fetch live ETH and BTC prices.
- The block simulator uses the browser `crypto.subtle.digest` API for SHA-256 hashing.
- Block 2 is linked to Block 1's hash to demonstrate immutability: when Block 1 changes, Block 2 becomes invalid until it is mined again.

## Improvements

- Add more coins to the live price dashboard.
- Add responsive mobile-specific layout tweaks.
- Persist simulator state in local storage for page refresh.
