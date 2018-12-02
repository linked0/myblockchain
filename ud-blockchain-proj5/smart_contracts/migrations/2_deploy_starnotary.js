var Notary = artifacts.require("./StarNotary.sol");

module.exports = function(deployer) {
  deployer.deploy(Notary);
};