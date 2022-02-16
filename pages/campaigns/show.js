import React, {Component} from "react";
import Layout from "../../components/Layout";
import Campaign from "../../campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../web3";
import ContributeForm from "../../components/ContributeForm";
import {Link} from "../../routes";

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            minContribution: summary[0],
            balance: summary[1],
            numOfRequest: summary[2],
            numOfContributors: summary[3],
            manager: summary[4],
            address: props.query.address
        }
    }

    renderCards() {
        const {
            balance,
            manager,
            minContribution,
            numOfRequest,
            numOfContributors
        } = this.props;

        const items = [
            {
                header: <h4>{manager}</h4>, 
                meta: "Address of Manager",
                description: "The manager created this campaign and can create requests for this campaign",
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minContribution,
                meta: "Mminimum Contribution (wei)",
                description: "You must contributue at least this much wei to be an approver"
            },
            {
                header: numOfRequest,
                meta: "Number of Requests",
                description: "A request tries to withdraw money from the contract. Request must be approved by approvers"
            },
            {
                header: numOfContributors,
                meta: "Number of Approvers",
                description: "Number of peope who ahve already donated to campaign"
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: "Campaign Balance (Ether)",
                description: "The balance is how much money this campaign has left to spend"
            }
        ];
        return <Card.Group items={items}/>;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid> 
            </Layout>
        );
    }
}

export default CampaignShow;