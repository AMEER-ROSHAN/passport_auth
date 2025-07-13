const PassportAuth = artifacts.require("PassportAuth");

module.exports = function(deployer) {
  deployer.deploy(PassportAuth);
};
