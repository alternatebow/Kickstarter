import {React, Component} from "react";
import { Button, Card } from "semantic-ui-react";
import factory from "../factory"
import Layout from "../components/Layout"
import {Link} from "../routes";

class CampaignIndex extends Component{
    // The 'static' keyword here means that the method is from the class
    // itself, not the instance of the class. So like a one-size-fits-all. 
    // Next doesn't want to actually have to render this component just to get 
    // the data. Better to just calling the method from the class rather
    // than waiting for an instance to render.
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return {campaigns};
    }
    // No 'componentDidMount' in this case, remember normally component renders
    // then we call our methods on the contract. But on server side rendering 
    // with Next.js we need the data before we show the component, so we have 
    // to get it (data) before it renders. Hence the 'getInitialProps()'. 

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    // LaTex script?
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                    
                    ),
                fluid: true
            };
        });

        return <Card.Group items={items}/>
    }

    render () {
        return (
            <Layout>
              <div>
                <h3>Open Campaigns</h3>
                <Link route="/campaigns/new">
                    <a>
                        <Button
                        floated="right"
                        content="Create Campaign"
                        icon="add circle"
                        // 'primary' by itself is just short hand for assigning
                        // the prop the value 'true'
                        primary
                        />   
                    </a>
                </Link>
                
                {this.renderCampaigns()}
                </div>  
            </Layout>
        )
    }
}

export default CampaignIndex;