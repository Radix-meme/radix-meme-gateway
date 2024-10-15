import { createRadixGateway, Network } from "./radixGateway";

export type TMainComponentData = {
  address: string;
  ownerBadge: string;
  maxTokenSupply: number;
  maxXrd: number;
  multiplier: string;
  tokensKvs: string;
};

export type TTokenData = {
  address: string;
  componentAddress?: string;
  progress?: number; // ready-to-dexter
  name?: string;
  symbol?: string;
  iconUrl?: string;
  imageUrl?: string;
  description?: string;
  telegramUrl?: string;
  xUrl?: string;
  website?: string;
  supply?: number;
  maxSupply?: number;
  xrdAmount?: number;
  maxXrdAmount?: number;
  lastPrice?: number;
};

// Factory function to create an API client for a specific Radix network
export function createRadixMemeGateway(network: Network) {
  const radixGateway = createRadixGateway(network);
  
  // Function to get main component state
  async function getMainComponentState(
    componentAddress: string
  ): Promise<TMainComponentData> {
    const result = {
      address: "",
      ownerBadge: "",
      maxTokenSupply: 0,
      maxXrd: 0,
      multiplier: "",
      tokensKvs: "",
    };
    const apiResult = await radixGateway.getRadixApiValue("state/entity/details", {
      addresses: [componentAddress],
      aggregation_level: "Global",
    });
    if (apiResult.status != 200) {
      console.error(
        "Problem fetching main component details for address: " +
          componentAddress,
        apiResult
      );
      throw new Error(apiResult.message);
    }
    if (apiResult.data?.items?.length <= 0) {
      return result;
    }
    const stateFields = apiResult.data.items[0].details?.state?.fields;
    stateFields.forEach((fieldData: any) => {
      switch (fieldData.field_name) {
        case "address":
          result.address = fieldData.value;
          break;
        case "owner_badge_manager":
          result.ownerBadge = fieldData.value;
          break;
        case "max_token_supply":
          result.maxTokenSupply = Number(fieldData.value);
          break;
        case "max_xrd":
          result.maxXrd = Number(fieldData.value);
          break;
        case "multiplier":
          result.maxXrd = fieldData.value;
          break;
        case "tokens":
          result.tokensKvs = fieldData.value;
          break;
      }
    });
    return result;
  }

  // Function to get all tokens data
  async function getAllTokensData(kvsAddress: string): Promise<TTokenData[]> {
    const tokenComponents = await getAllTokensComponents(kvsAddress);
    const result: TTokenData[] = await Promise.all(
      tokenComponents?.map((tokenComponent) => {
        return getTokenData(tokenComponent);
      })
    );
    return result;
  }

  // Function to get all token components
  async function getAllTokensComponents(kvsAddress: string): Promise<string[]> {
    let result: string[] = [];
    const apiResult = await radixGateway.getRadixApiValue("state/key-value-store/keys", {
      key_value_store_address: kvsAddress,
    });
    if (apiResult.status != 200) {
      console.error(
        "Problem fetching all tokens components from Radix API.",
        apiResult
      );
      return result;
    }
    if (!apiResult.data?.items) {
      return result;
    }
    result = apiResult.data.items.map(
      (kvsItemData: any) => kvsItemData.key?.programmatic_json?.value
    );
    return result;
  }

  // Function to get token data
  async function getTokenData(tokenComponent: string): Promise<TTokenData> {
    const result: TTokenData = {
      address: "",
      componentAddress: tokenComponent,
      progress: 0,
      name: "",
      symbol: "",
      imageUrl: "",
      description: "",
      telegramUrl: "",
      xUrl: "",
      website: "",
      supply: 0,
      maxSupply: 0,
      xrdAmount: 0,
      maxXrdAmount: 0,
    };

    // First API call to get component's metadata
    const getComponentApiResult = await radixGateway.getRadixApiValue(
      "state/entity/details",
      {
        addresses: [tokenComponent],
        aggregation_level: "Global",
      }
    );

    if (getComponentApiResult.status != 200) {
      throw new Error(
        `Problem fetching component details for token component: ${tokenComponent}. API Result: ${JSON.stringify(
          getComponentApiResult
        )}`
      );
    }
    if (getComponentApiResult.data.items.length === 0) {
      return result;
    }

    // Extract metadata from component
    const componentStateFields =
      getComponentApiResult.data.items[0].details?.state?.fields;
    for (const fieldData of componentStateFields) {
      switch (fieldData.field_name) {
        case "token_manager":
          result.address = fieldData.value;
          break;
        case "current_supply":
          result.supply = Number(fieldData.value);
          break;
        case "max_supply":
          result.maxSupply = Number(fieldData.value);
          break;
        case "max_xrd":
          result.maxXrdAmount = Number(fieldData.value);
          break;
      }
    }

    // Get current XRD amount inside vault
    const componentFungibleResources =
      getComponentApiResult.data.items[0].fungible_resources?.items;
    if (componentFungibleResources.length > 0) {
      const xrdResource = componentFungibleResources.find(
        (resObj: { resource_address: string | undefined }) =>
          resObj.resource_address === process.env.NEXT_PUBLIC_XRD_ADDRESS
      );
      if (xrdResource && typeof xrdResource.amount === "string") {
        result.xrdAmount = Number(xrdResource.amount);
      }
    }

    // compute progress
    if (result.xrdAmount && result.maxXrdAmount) {
      result.progress = result.xrdAmount / result.maxXrdAmount;
    }

    // If no resource address found, do not continue
    if (!result.address) {
      return result;
    }

    // Second API call to get metadata of the resource
    const getResourceApiResult = await radixGateway.getRadixApiValue(
      "state/entity/page/metadata",
      {
        address: result.address,
      }
    );

    if (getResourceApiResult.status != 200) {
      console.error(
        `Problem fetching metadata for token: ${
          result.address
        }. API Result: ${JSON.stringify(getResourceApiResult)}`
      );
      return result;
    }

    if (!getResourceApiResult.data.items) {
      return result;
    }

    // Extract metadata from resource
    for (const data of getResourceApiResult.data.items) {
      switch (data.key) {
        case "name":
          result.name = data.value.typed.value;
          break;
        case "symbol":
          result.symbol = data.value.typed.value;
          break;
        case "description":
          result.description = data.value.typed.value;
          break;
        case "icon_url":
          result.iconUrl = data.value.typed.value;
          break;
        case "image_url":
          result.imageUrl = data.value.typed.value;
          break;
        case "telegram":
          result.telegramUrl = data.value.typed.value;
          break;
        case "x":
          result.xUrl = data.value.typed.value;
          break;
        case "website":
          result.website = data.value.typed.value;
          break;
      }
    }
    return result;
  }

  // Return the API methods
  return {
    getMainComponentState,
    getAllTokensData,
    getAllTokensComponents,
    getTokenData,
  };
}

// Example usage:
// const radixMemeGateway = createRadixMemeGateway(Network.STOKENET);
// await radixMemeGateway.getMainComponentState("component_address");
// await radixMemeGateway.getAllTokensData("component_address");
