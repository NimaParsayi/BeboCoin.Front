<template>
    <section class="section_wallet py-4">
        <div class="flex-center flex-column">
            <h1 class="fs-large fw-bold text-color">Deposit</h1>
        </div>
        <div class="mt-4 bg-card box-shadow p-3 rounded-2">
            <w3m-button />
        </div>
        <div class="mt-3 bg-card box-shadow p-3 rounded-2">
            <div class="d-flex flex-column">
                <span class="description-color d-flex align-items-center fs-small fw-bold">
                    <WalletIcon width="16px" height="16px" />
                    Deposit To Wallet
                </span>
                <div class="d-flex align-items-center justify-content-between">
                    <button @click="sendReq()"
                        class="wallet_button flex-center rounded-2 box-shadow p-2 text-color fs-medium fw-bold">Send
                        Transaction</button>
                    <!-- <div class="col-6">
                        <input class="w-full text-color fs-large fw-bold mt-1" v-model.number="amount"
                            @keypress="isNumber($event)" type="number" />
                    </div>
                    <div class="flex-center col-6">
                        <div class="col-3 bg-card mr-1 flex-center rounded-2 box-shadow p-1">
                            <img width="35px" src="@/assets/images/icon/ton.png" alt="" />
                        </div>

                        <button @click="sendTonTransaction()"
                            class="col-10 wallet_button flex-center rounded-2 box-shadow p-2">
                            <span class="text-color fs-medium fw-bold flex-center"> Deposit </span>
                        </button>
                    </div> -->
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { parseEther } from 'viem'
import { mainnet, bsc, bscTestnet } from 'viem/chains'
import { reconnect, sendTransaction } from '@wagmi/core'
///import { IsAuthenticated, requestGet } from "@/stores/commonStore";
//import { useWeb3Modal } from '@web3modal/wagmi/vue'

const projectId = 'b14e381d22f2009c0e104ada02de5bbd'

const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, bsc, bscTestnet]
const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    //...wagmiOptions // Optional - Override createConfig parameters
})

reconnect(config)
// 3. Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
})

const sendReq = async () => {
    // await requestGet("/wallet/get").then((json) => {
    //     if (!json) return;
    //     console.log(json)
    // });
    // if (!IsAuthenticated) return;
    const result = await sendTransaction(config, {
        to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
        value: parseEther('0.01'),
    })
    console.log(result);
}

</script>
<script>
export default {

}
</script>
<style lang="">

</style>