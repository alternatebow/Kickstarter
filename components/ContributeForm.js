import React, {Component} from "react";
import {Button, Form, Input, Message, MessageHeader} from "semantic-ui-react";
import Campaign from "../campaign"
import web3 from "../web3";
import {Router} from "../routes";

class ContributeForm extends Component {
    state = {
        value: "",
        loading: false,
        errorMessage: ""
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        this.setState({loading: true, errorMessage: ""});
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (err) {
            this.setState({errorMessage: err.message})
        }

        this.setState({loading: false, value: ''})
    }
    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({value: event.target.value})}
                        label="Ether"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message error header="Oops!" 
                        content={this.state.errorMessage}/>
                <Button
                    primary
                    loading={this.state.loading}
                >
                    Contribute!
                </Button>
            </Form>
        )
    }
}

export default ContributeForm;