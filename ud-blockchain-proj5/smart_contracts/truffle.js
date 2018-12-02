var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "fiber green muscle two credit spot arrive bridge keep friend flower hello";

// 'StarNotary Submission' Project on Inpura.io

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/dad8a9fd5be042539c554a17f196e402')
      },
      network_id: 4,
      gas: 7000000,
      gasPrice: 10000000000,
    }
  }
};