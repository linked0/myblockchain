/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
networks: {
  development: {
   host: "127.0.0.1",
   port: 9545,
   network_id: "*" // Match any network id
 },
 rinkeby: {
  provider: function() {
 return new HDWalletProvider("fiber green muscle two credit spot arrive bridge keep friend flower hello", "https://rinkeby.infura.io/v3/99372991bbed414bb85a7f9ccfcdeb54")
     },
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000,
    }
   }
 };