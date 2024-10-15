# Radix Meme Gateway

This package provides a utility to fetch data relevant to the [radix.meme](https://radix.meme) app directly from the radix ledger by using public gateway APIs. The APIs are called using axios (not with the GatewayAPI SDK). 

## Example Usage

```ts
import { createRadixGateway, Network } from "radix-meme-gateway";

// Initialize gateway for a specific network
const radixGateway = createRadixGateway(Network.MAINNET);

// TODO: Add documentation
// Public APIs
await radixGateway.getRadixApiValue(...)
await radixGateway.getTransactionStatus(...)
await radixGateway.getTransactionDetail(...)
```
