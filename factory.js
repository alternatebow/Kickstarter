import web3 from "./web3";
import CampaignFactory from "./build/contracts/CampaignFactory.json";

const instance = new web3.eth.Contract(CampaignFactory.abi, "0xb38F0348dd688e35382142367De5CAEBA2972364");

export default instance;