const axios = require("axios");
const { createRadixMemeGateway, radixMemeAddressbook } = require("./dist/index");

const rmg = createRadixMemeGateway({
  network: "STOKENET",
  componentAddress: radixMemeAddressbook.STOKENET.latest.componentAddress
});

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.log(fs.readFileSync("init-dev-env-message.txt", "utf8"));
console.log("\n\n");
