<template>
  <section class="section_wallet py-4">
    <div class="flex-center flex-column">
      <h1 class="fs-large fw-bold text-color">Deposit</h1>
    </div>
    <div class="mt-4 bg-card box-shadow p-3 rounded-2">
      <div class="d-flex flex-column">
        <span class="description-color d-flex align-items-center fs-small fw-bold">
          <WalletIcon width="16px" height="16px" />
          Your Wallet Balance
        </span>
        <h1 class="text-color fs-large fw-bold mt-2">
          ${{ balance ? formatNumber(balance) : 0 }}
        </h1>
      </div>
      <div class="d-flex flex-column mt-2">
        <div id="ton-connect" class="wallet_button flex-center rounded-2 box-shadow p-2">
          <span class="text-color fs-medium fw-bold flex-center" @click="toggleTonConnect" >
            <span v-if="isTonWalletConnected">Connected to {{ tonConnectUI.walletInfo.name }} as Ton Wallet</span>
            <span v-else>Connect Ton Wallet</span>
          </span>
        </div>
      </div>
      
    <div class="mt-4 bg-card box-shadow p-3 rounded-2">
      <div class="d-flex flex-column">
        <span class="fw-bold">You don't want use $TON? </span> 
        <span class="wallet_button flex-center rounded-2 box-shadow p-2 fw-bold mt-3" @click="redirectToWalletConnect">Use Wallet Connect</span>
        </div>
    </div>
    </div>
    <div class="mt-3 bg-card box-shadow p-3 rounded-2" v-if="isTonWalletConnected">
      <div class="d-flex flex-column">
        <span class="description-color d-flex align-items-center fs-small fw-bold">
          <WalletIcon width="16px" height="16px" />
          Deposit To Wallet
        </span>
        <div class="d-flex align-items-center justify-content-between">
          <div class="col-6">
            <input class="w-full text-color fs-large fw-bold mt-1" v-model.number="amount"
              @keypress="isNumber($event)" type="number" />
          </div>
          <div class="flex-center col-6">
            <div class="col-3 bg-card mr-1 flex-center rounded-2 box-shadow p-1">
              <img width="35px" src="@/assets/images/icon/ton.png" alt="" />
            </div>

            <button @click="sendTonTransaction()" class="col-10 wallet_button flex-center rounded-2 box-shadow p-2">
              <span class="text-color fs-medium fw-bold flex-center"> Deposit </span>
            </button>
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
}

const redirectToWalletConnect = () => {
  //$router.push('/WalletConnect')
  window.Telegram.WebApp.openLink("/WalletConnect")
}

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
