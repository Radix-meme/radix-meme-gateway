/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import axios, { AxiosInstance } from "axios";

export enum Network {
  MAINNET = "mainnet",
  STOKENET = "stokenet",
}

export interface ApiResult {
  status: number;
  message: string;
  data: any;
}

// Factory function to create an API client for a specific Radix network
export function createRadixGateway(network: Network) {
  const apiServer: AxiosInstance = axios.create({
    baseURL:
      network === Network.MAINNET
        ? "https://mainnet.radixdlt.com"
        : "https://babylon-stokenet-gateway.radixdlt.com",
  });
  console.log(`Radix network set to '${network}'`);

  // Function to get transaction status
  async function getTransactionStatus(
    tx_intent_hash: string
  ): Promise<ApiResult> {
    return getRadixApiValue("transaction/status", {
      intent_hash_hex: tx_intent_hash,
    });
  }

  // Function to get transaction detail
  async function getTransactionDetail(
    tx_intent_hash: string
  ): Promise<ApiResult> {
    return getRadixApiValue("transaction/committed-details", {
      intent_hash: tx_intent_hash,
      opt_ins: {
        raw_hex: "false",
        receipt_state_changes: "true",
        receipt_fee_summary: "true",
        receipt_events: "true",
        affected_global_entities: "true",
      },
    });
  }

  // General function to interact with the Radix API
  async function getRadixApiValue(
    url: string,
    params: any = {},
    retry = 0,
    max_retries = 1
  ): Promise<ApiResult> {
    let apiRes;
    try {
      apiRes = await apiServer.request({
        method: "post",
        url: "/" + url,
        data: params,
      });
      return {
        status: apiRes.status,
        message: apiRes.statusText,
        data: apiRes.data,
      };
    } catch (error) {
      const errorResult = getAxiosError(error);
      if (retry < max_retries) {
        return getRadixApiValue(url, params, retry + 1, max_retries);
      } else {
        return errorResult;
      }
    }
  }

  // Function to handle axios errors
  function getAxiosError(error: any): ApiResult {
    if (error.response) {
      return {
        status: error.response.status,
        message: `Radix API error. ${error.response.data.message || ""}`,
        data: error.response.data || {},
      };
    } else if (error.request) {
      return {
        status: 0,
        message: `No response received from the server. ${error.message}`,
        data: {},
      };
    } else if (error.message) {
      return {
        status: 0,
        message: `API request error. ${error.message}`,
        data: {},
      };
    } else {
      console.error("Unknown axios error encountered.", error);
      return { status: 0, message: "Unknown error encountered.", data: {} };
    }
  }

  // Return public API functions
  return {
    getTransactionStatus,
    getTransactionDetail,
    getRadixApiValue,
  };
}

// // Example usage:
// const radixGateway = createRadixGateway(Network.MAINNET);
// radixGateway.getTransactionStatus("tx_intent_hash_here").then(console.log);
