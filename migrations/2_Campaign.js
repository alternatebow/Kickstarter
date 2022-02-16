const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require('CampaignFactory')

module.exports = (deployer, network, accounts) => {
  deployer.deploy(CampaignFactory, 0);
};
