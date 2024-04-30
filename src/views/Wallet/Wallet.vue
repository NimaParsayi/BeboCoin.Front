<template>
  <section class="section_wallet py-4">
    <div class="flex-center flex-column">
      <h1 class="fs-large fw-bold text-color">Deposit</h1>
    </div>
    <div class="mt-3 bg-card box-shadow p-3 rounded-2">
      <div class="d-flex flex-column">
        <span class="text-color fs-small fw-bold mb-3">Payment in $TON</span>
        <div id="ton-connect" class="wallet_button flex-center rounded-2 box-shadow p-2">
          <span class="text-color fs-medium fw-bold flex-center">
            Connect Ton Wallet
          </span>
        </div>
      </div>
    </div>
    <div class="mt-4 bg-card box-shadow p-3 rounded-2">
      <div class="d-flex flex-column">
        <span class="description-color d-flex align-items-center fs-small fw-bold">
          <WalletIcon width="16px" height="16px" />
          Connect Wallet Balance
        </span>
        <h1 class="text-color fs-large fw-bold mt-1">
          ${{ balance ? formatNumber(balance) : 0 }}
        </h1>
        <div class="d-flex align-items-center mt-3">
          <div class="col-6 px-1">
            <button type="button" @click="changeWalletStatus"
              :class="connectedWallet ? 'wallet_button' : 'btn btn-primary'">Connect to a Wallet</button>
          </div>
          <div v-if="address" class="col-6 px-1">
            <div @click="switchAccount()" class="wallet_button flex-center rounded-2 box-shadow p-2">
              <span class="text-color fs-medium fw-bold flex-center"> Change </span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="mt-3 bg-card box-shadow p-3 rounded-2">
      <div class="d-flex flex-column">
        <span class="description-color d-flex align-items-center fs-small fw-bold">
          <WalletIcon width="16px" height="16px" />
          Deposit To Wallet
        </span>
        <div class="d-flex align-items-center justify-content-between">
          <div class="col-6">
            <input class="w-full text-color fs-large fw-bold mt-1" value="0" v-model.number="amount"
              @keypress="isNumber($event)" type="number" />
          </div>
          <div class="flex-center col-6">
            <div class="col-3 bg-card mr-1 flex-center rounded-2 box-shadow p-1">
              <img width="35px" src="@/assets/images/icon/ethereum.png" alt="" />
            </div>

            <div @click="reqTransaction" class="col-10 wallet_button flex-center rounded-2 box-shadow p-2">
              <span class="text-color fs-medium fw-bold flex-center"> Deposit </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import WalletIcon from "@/components/Icons/WalletIcon.vue";
import { formatNumber } from "@/extensions/numberExtension";
import { ref } from "vue";
import { parseEther } from 'viem'
import { init, useOnboard } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import trustModule from '@web3-onboard/trust'
import walletConnectModule from '@web3-onboard/walletconnect'

const amount = ref(0);
const injected = injectedModule()
const infuraKey = '70bc963325bf41f084d97fe2dfd489e7'
const rpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`

init({
  theme: 'light',
  wallets: [injected, trustModule(), walletConnectModule({ projectId: 'b14e381d22f2009c0e104ada02de5bbd' })],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: rpcUrl
    },
    {
      id: 11155111,
      token: 'ETH',
      label: 'Sepolia',
      rpcUrl: 'https://rpc.sepolia.org/'
    },
    {
      id: 42161,
      token: 'ARB-ETH',
      label: 'Arbitrum One',
      rpcUrl: 'https://rpc.ankr.com/arbitrum'
    },
    {
      id: '0xa4ba',
      token: 'ARB',
      label: 'Arbitrum Nova',
      rpcUrl: 'https://nova.arbitrum.io/rpc'
    },
    {
      id: '0x2105',
      token: 'ETH',
      label: 'Base',
      rpcUrl: 'https://mainnet.base.org'
    },
    {
      id: '0x38',
      token: 'BNB',
      label: 'Binance Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org/'
    },
    {
      id: '0x61',
      token: 'tBNB',
      label: 'Binance Smart Chain TestNet',
      rpcUrl: 'https://public.stackup.sh/api/v1/node/bsc-testnet'
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Matic Mainnet',
      rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
    },
    {
      id: '0xfa',
      token: 'FTM',
      label: 'Fantom Mainnet',
      rpcUrl: 'https://rpc.ftm.tools/'
    },
    {
      id: 666666666,
      token: 'DEGEN',
      label: 'Degen',
      rpcUrl: 'https://rpc.degen.tips'
    }
  ],
  connect: {
    autoConnectLastWallet: true
  }
})

const { connectedWallet, connectWallet, disconnectWallet } = useOnboard()

if (connectedWallet?.provider) {
  const ethersProvider = new ethers.providers.Web3Provider(
    connectedWallet.provider,
    'any'
  )
  console.log(ethersProvider)
}

const changeWalletStatus = async () => {
  const { provider, label } = connectedWallet.value || {}
  if (provider && label) {
    disconnectWallet({ label })
  } else {
    connectWallet()
  }
}

const reqTransaction = async () => {
  const { provider } = connectedWallet.value;
  console.log(provider)
  const ethersProvider = new ethers.providers.Web3Provider(provider, 'any')
  const signer = ethersProvider.getSigner()
  const txDetails = {
    to: '0xfB9bA5393233Ae1023e7a559ff448AC5AF654236',
    value: parseEther('0.1')
  }

const sendMessage = () => {
  return signer.signMessage("Hello World!").then(tx => console.log(tx))
}

  const sendTransaction = () => {
    return signer.sendTransaction(txDetails).then(tx => console.log(tx))
  }
  const gasPrice = () => ethersProvider.getGasPrice().then(res => res.toString())

  const estimateGas = () => {
    return ethersProvider.estimateGas(txDetails).then(res => res.toString())
  }
  console.log(sendMessage(),sendTransaction(), gasPrice(), estimateGas())
  // const transactionHash = await onboard.state.actions.preflightNotifications({
  //   sendTransaction,
  //   gasPrice,
  //   estimateGas,
  //   balance: 0,
  //   txDetails: txDetails
  // })
  //console.log(transactionHash)
}

// import { TON_WALLET_BOT_LINK } from "@/constants/configuration";
// import EthersService from "@/extensions/ethExtension";
// import { reconnect } from "@wagmi/core";
// // import { parseEther } from 'viem'
// import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
// import { mainnet, opBNBTestnet, bscTestnet } from "viem/chains";
// import TonConnectUI from '@tonconnect/ui'

// const ethersService = new EthersService();

// const address = ref("");
// // const balance = ref(0.0);
// const amount = ref(0);

// const projectId = "4fd0154d93f56d70fe1bbe05f6174944";

// const metadata = {
//   name: "Bebo Coin",
//   description: "Web3Modal",
//   url: "https://bebocoin.site",
//   icons: ["https://avatars.githubusercontent.com/u/37784886"],
// };

// const chains = [mainnet, opBNBTestnet, bscTestnet];
// const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
// });

// reconnect(config);
// ethersService.connectWallet();

// createWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   enableAnalytics: true,
//   enableOnramp: true,
// });

// const isNumber = async (evt) => {
//   const keysAllowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
//   const keyPressed = evt.key;
//   if (!keysAllowed.includes(keyPressed)) {
//     evt.preventDefault();
//   }
// };

// const reqTransaction = async () => {

//   await ethersService.connectWallet();
//   if (ethersService.address) {
//   console.log(ethersService.address);
//     await ethersService.sendTransaction(
//       ethersService.address,
//       "0xfB9bA5393233Ae1023e7a559ff448AC5AF654236",
//       amount.value.toString()
//     );
//   }

//   // reconnect(config);
//   // const account = getAccount();
//   // console.log(account);
//   // const { hash } = await sendTransaction({
//   //   to: '0xfB9bA5393233Ae1023e7a559ff448AC5AF654236',
//   //   value: parseEther('0.01'),
//   // })
//   // console.log(hash);
//   // return true;
// };

// const tonConnectUI = new TonConnectUI({
//     manifestUrl: 'https://127.0.0.1:5050/tonconnect-manifest.json',
//     buttonRootId: 'ton-connect'
// });
// const currentState = tonConnectUI.singleWalletModalState;
// console.log('Current modal state:', currentState);

</script>

<script>
export default {
  name: "WalletView",
  methods: {
    formatNumber(amount) {
      return formatNumber(amount);
    },
  },

  components: {}
};
</script>


<style>
.v-btn-container {
  width: 100% !important;
}

.wallet_connect {
  padding: var(--size-space-2) !important;
  width: 100% !important;
}

.luck {
  cursor: not-allowed;
  opacity: 0.4;
}

.luck input {
  pointer-events: none !important;
}
</style>
