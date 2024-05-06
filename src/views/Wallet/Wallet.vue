<template>
  <section class="section_wallet py-4">
    <div class="flex-center flex-column">
      <h1 class="fs-large fw-bold text-color">Deposit</h1>
    </div>
    <div class="mt-3 bg-card box-shadow p-3 rounded-2">
      <div class="d-flex flex-column" @click="toggleTonConnect" id="tonConnect">
        <span class="text-color fs-small fw-bold mb-3">Payment in $TON</span>
        <div id="ton-connect" class="wallet_button flex-center rounded-2 box-shadow p-2">
          <span class="text-color fs-medium fw-bold flex-center">
            <span v-if="isTonWalletConnected">Connected to {{ tonConnectUI.walletInfo.name }} as Ton Wallet</span>
            <span v-else>Connect Ton Wallet</span>
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

            <div @click="sendTonTransaction()" class="col-10 wallet_button flex-center rounded-2 box-shadow p-2">
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
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { formatNumber } from "@/extensions/numberExtension";
import { ref } from "vue";
import { parseEther } from 'viem'
import { init, useOnboard } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import trustModule from '@web3-onboard/trust'
import walletConnectModule from '@web3-onboard/walletconnect'
import { TonConnectUI } from '@tonconnect/ui'
import { TON_CONNECT_MANIFEST_URL } from '@/constants/configuration';
import { IsAuthenticated, requestGet, requestPost } from "@/stores/commonStore";
import { toNano, fromNano } from '@ton/ton'


let amount = ref(0);
let balance = ref(0);
let tonWallet = ref("");
let isTonWalletConnected = ref(false);
const $toast = useToast();

const updateWallet = async () => {
  await requestGet("/wallet/get").then((json) => {
    if (!json) return;
    balance.value = json.result.balance;
    amount.value = 0;
  });
}

updateWallet();

const tonConnectUI = new TonConnectUI({ manifestUrl: TON_CONNECT_MANIFEST_URL });
tonConnectUI.uiOptions = {
  twaReturnUrl: 'https://t.me/BeboCoinBot'
};

const toggleTonConnect = async () => {
  const { modal } = tonConnectUI;
  if (!isTonWalletConnected.value) {
    await modal.open();
  } else {
    tonConnectUI.disconnect();
    isTonWalletConnected.value = false;
    $toast.error("You're now disconnected from Ton Wallet");
  }
}

tonConnectUI.onModalStateChange(state => {
  const { walletInfo } = tonConnectUI;
  if (state.closeReason === "wallet-selected") {
    tonWallet.value = walletInfo.name;
    isTonWalletConnected.value = true;
    $toast.success("You are connected to " + tonWallet.value)
  }
});

const sendTonTransaction = async () => {
  if (!IsAuthenticated) return;


  const tonWalletAddress = await requestGet('/Transaction/GetTonWallet').then((json) => {
    if (!json) return;
    return json.result;
  })

  if (isTonWalletConnected.value) {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 120, // 2 mins
      messages: [
        {
          address: tonWalletAddress,
          amount: toNano(`${amount.value}`).toString()
        },
      ]
    }

    try {
      tonConnectUI.sendTransaction(transaction).then(result => {

        const objects = {
          network: "Ton",
          Connection: 1,
          amount: fromNano(transaction.messages[0].amount),
          boc: result.boc
        }
        console.log(objects);

        requestPost("/Transaction/Add", objects).then((json) => {
          if (!json) return;
          $toast.success("Transaction was successful.")
          updateWallet();
          return json.result;
        }).catch(err => {
          $toast.error("Transaction was failed or canceled.")
          console.log(err);
        })
      });

    } catch (e) {
      $toast.error("Transaction was failed or canceled.")
    }
  }
  else {
    await reqTransaction();
  }
}

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

const changeWalletStatus = async () => {
  const { provider, label } = connectedWallet.value || {}
  if (provider && label) {
    disconnectWallet({ label })
  } else {
    connectWallet()
  }
}

const reqTransaction = async () => {
  const { provider, label } = connectedWallet.value;
  console.log(label)
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
    //return signer.sendTransaction(txDetails).then(tx => console.log(tx))
  }
  const gasPrice = () => ethersProvider.getGasPrice().then(res => res.toString())

  const estimateGas = () => {
    return ethersProvider.estimateGas(txDetails).then(res => res.toString())
  }
  console.log(sendMessage(), sendTransaction(), gasPrice(), estimateGas())
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


const isNumber = async (evt) => {
  const keysAllowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  const keyPressed = evt.key;
  if (!keysAllowed.includes(keyPressed)) {
    evt.preventDefault();
  }
};


</script>

<script>
export default {
  name: "WalletView",
  // data() {
  //   return{
  //     balance: 0
  //   }
  // },
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
