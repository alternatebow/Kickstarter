const compiledCampaign = require('/home/sensor47/kickStarter/build/contracts/Campaign.json')
const {assert} = require('chai');
const ganache = require('ganache-cli');

const CampaignFactory = artifacts.require('CampaignFactory');
const Campaign = artifacts.require('Campaign')
let factory, campaignAddress, campaign;

contract('Kickstarter', (accounts) => {
    before (async () => {
        factory = await CampaignFactory.new();
        await factory.createCampaign("100", {
            from: accounts[1]
        });
        [campaignAddress] = await factory.getDeployedCampaigns({
            from: accounts[1]
        })
        campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
    })

    it('Should return the correct address', async () => {
        assert.ok(factory.address);
        assert.ok(campaign.options.address);
    });

    it('Mark the caller as the manager', async () => {
        const manager = await campaign.methods.manager().call({from: accounts[0]});
        assert.equal(manager, accounts[1]);
    })

    it('Allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({from: accounts[0], value: '200'});
        const isContributor = await campaign.methods.approvers(accounts[0]).call({from: accounts[1]});
        assert(isContributor);
    });

    it('Requires a minimum contribution', async () => {
        try{
            await campaign.methods.contribute().send({from: accounts[2], value: '50'});
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest("Buy batteries", "100", accounts[0]).send({
                from: accounts[1],
                gas: '1000000'
            });
        let request = await campaign.methods.requests(0).call({
            from: accounts[1]
        });
        assert.equal('Buy batteries', request.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[0]).send({
            from: accounts[1],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(1).send({
            from: accounts[1],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(1).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(1).send({
            from: accounts[1],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[0]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance)
        assert(balance > 104);

    })
});

