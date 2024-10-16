const axios = require("axios");
const { createRadixMemeGateway, createRadixGateway, radixMemeAddressbook } = require("./dist/index");

const radixMemeGateway = createRadixMemeGateway({
  network: "STOKENET",
  componentAddress: radixMemeAddressbook.STOKENET.latest.componentAddress
});

const radixGateway = createRadixGateway("STOKENET");

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.log(fs.readFileSync("init-dev-env-message.txt", "utf8"));
console.log("\n\n");
