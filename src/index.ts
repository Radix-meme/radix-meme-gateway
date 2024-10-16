import {
  createRadixMemeGateway,
  TMainComponentData,
  TTokenData,
} from "./radixMemeGateway";
import { Network, createRadixGateway } from "./radixGateway";

const radixMemeAddressbook = {
  MAINNET: {
    latest: {},
  },
  STOKENET: {
    latest: {
      dAppAddress:
        "account_tdx_2_1c9vx8umn2cu5nhrgzxxcl83l89lnukhcj9974h5duzltg5rznun6ly",
      componentAddress:
        "component_tdx_2_1cqxv84t8tya5q0rwasdlwyu57cyw9x52trsgfqarjfc0yx0f4980g7",
      tokensKvs: "",
    },
    v1: {
      dAppAddress:
        "account_tdx_2_1c82ga7u742dx8qdvxf7jj5a77ke2r6juwcgvpa9z8eacye9fvhyq4t",
      componentAddress:
        "component_tdx_2_1cqksjzx0rfwykk03p7vhsk92pwues9dgs5hj3jn4yc5fv0hrmy44fs",
      tokensKvs: "",
    },
    v2: {
      dAppAddress:
        "account_tdx_2_1cx6gtvkqujyzn520melqnfn6cgg8g5ukvsgleup0mz2zcnymq5lnup",
      componentAddress:
        "component_tdx_2_1cq5mvvmtr7xq90c5nkyxrlzdd2genzu9cdlv4q9mfjd8zslagat8lx",
      tokensKvs: "",
    },
  },
};

export {
  createRadixMemeGateway,
  createRadixGateway,
  radixMemeAddressbook,
  Network,
  TMainComponentData,
  TTokenData,
};
