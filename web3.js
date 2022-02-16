import Web3 from "web3";
// const web3 = new Web3(Web3.givenProvider);
let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== "undefined") {
    // If this is the case, then we are in the browser and have metamask
    web3 = new Web3(window.ethereum);
} else {
    // In this case, we are on server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/bba827c8dea042ef86582d8cc9581550");
    web3 = new Web3(provider);
}

export default web3;