<template>
    <div>
        <button @click="sendTransaction">Connect And Send</button>
    </div>
</template>
<script setup>
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

let accountsList, chainIdVar;

// Create a connector
const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
});

// Check if connection is already established
if (!connector.connected) {
    // create new session
    connector.createSession();
}

// Subscribe to connection events
connector.on("connect", (error, payload) => {
    if (error) {
        throw error;
    }

    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    accountsList = accounts;
    chainIdVar = chainId;
});

connector.on("session_update", (error, payload) => {
    if (error) {
        throw error;
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    accountsList = accounts;
    chainIdVar = chainId;
});

connector.on("disconnect", (error, payload) => {
    if (error) {
        throw error;
    }

    // Delete connector
    const { accounts, chainId } = payload.params[0];
    accountsList = accounts;
    chainIdVar = chainId;
});

const sendTransaction = () => {
    console.log(accountsList);
    console.log(chainIdVar);

    const network = 118; // Atom (SLIP-44)
    const account = accountsList.find((account) => account.network === network);
    // Transaction structure based on Trust's protobuf messages.
    const tx = {
        accountNumber: "1035",
        chainId: "cosmoshub-2",
        fee: {
            amounts: [
                {
                    denom: "uatom",
                    amount: "5000",
                },
            ],
            gas: "200000",
        },
        sequence: "40",
        sendCoinsMessage: {
            fromAddress: account.address,
            toAddress: "cosmos1zcax8gmr0ayhw2lvg6wadfytgdhen25wrxunxa",
            amounts: [
                {
                    denom: "uatom",
                    amount: "100000",
                },
            ],
        },
    };

    const request = connector._formatRequest({
        method: "trust_signTransaction",
        params: [
            {
                network,
                transaction: JSON.stringify(tx),
            },
        ],
    });

    connector
        ._sendCallRequest(request)
        .then((result) => {
            // Returns transaction signed in json or encoded format
            console.log(result);
        })
        .catch((error) => {
            // Error returned when rejected
            console.error(error);
        });
}
</script>
<script>
export default {

}
</script>
<style lang="">

</style>