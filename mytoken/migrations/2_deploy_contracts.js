var sampleToken = artifacts.require("./sampleToken.sol");

module.exports = function(deployer) {
  deployer.deploy(sampleToken);
};