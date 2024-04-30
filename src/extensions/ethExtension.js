import { ethers } from "ethers";

export default class EthersService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.address = "";
        this.lineaNetwork = {
            chainId: 12345, // Replace with the actual chainId for LINEA
            name: "LINEA",
            rpcUrl: "https://rpc.linea.network", // Replace with the actual RPC URL for LINEA
        };
    }

    async connectWallet() {
        try {
            const { ethereum } = await window;
            if (!ethereum) {
                alert("Must connect to MetaMask!");
                return;
            }
            const myAccounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            this.address = myAccounts[0];

            console.log("Connected: ", myAccounts[0]);
            return myAccounts[0];
        } catch (error) {
            return console.log(error);
        }
    }

    async getBalance(address) {
        try {
            const { ethereum } = await window;
            if (ethereum) {
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                const balance = await this.provider.getBalance(address);
                return ethers.utils.formatEther(balance);
            }

        } catch (error) {
            console.log(error);
        }
    }
    async sendTransaction(sender, receiver, strEther) {
        try {
            const { ethereum } = await window;
            if (ethereum) {
                let provider = new ethers.providers.Web3Provider(ethereum);

                const params = [{
                    from: sender,
                    to: receiver,
                    value: ethers.utils.parseUnits(strEther, 'ether').toHexString()
                }];

                await provider.send('eth_sendTransaction', params)
                    .then(val => console.log(val.code))
            }
        } catch (err) {
            console.log(err)
        }

    }

}
