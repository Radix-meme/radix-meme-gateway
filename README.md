# Radix Meme Gateway

This package provides a utility to fetch data relevant to the [radix.meme](https://radix.meme) app directly from the radix ledger by using public gateway APIs. The APIs are called using axios (not with the GatewayAPI SDK). 

## Usage

**Install**

```bash
npm install radix-meme-gateway
```

**Initialize Service**

```ts
import { createRadixGateway, Network, radixMemeAddressbook } from "radix-meme-gateway";

// show all stored ledger addresses
console.log(radixMemeAddressbook);

// initialize service
const radixMemeGateway = createRadixGateway({
  network: Network.STOKENET,
  componentAddress: radixMemeAddressbook.STOKENET.latest.componentAddress,
});

// Show config of an instance
console.log(radixMemeGateway.getConfig());
```

**API endpoints**

```ts
// Fetch all tokens
const tokens = await radixMemeGateway.getAllTokens();

// Fetch token
const token = await radixMemeGateway.getToken("component_tdx_2_1cqcfndu8u4658fw68lu272sm0mwf38ms5p9dchpskn9rxwptpu05k4");

// Fetch transactions of a given token
// PENDING - NOT IMPLEMENTED YET
```

## REPL test environment

To test the gateway in a JS REPL, you can simply run:

```bash
npm run repl
```

You should see an interactive javascript REPL environment, where you can test the functions in realtime.

<img width="600" alt="Bildschirmfoto 2024-10-15 um 15 43 58" src="https://github.com/user-attachments/assets/4b369bfa-e3e7-4fab-b53a-4d94b23479b9">
