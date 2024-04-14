<template>
  <section class="section_wallet py-4">
    <div class="flex-center flex-column">
      <h1 class="fs-large fw-bold text-color">Deposit</h1>
    </div>
    <div class="mt-3 bg-card box-shadow p-3 rounded-2">
      <div class="d-flex flex-column">
        <span class="text-color fs-small fw-bold mb-3">Payment With Ton</span>
        <div
          @click="tonWalletConnect"
          class="wallet_button flex-center rounded-2 box-shadow p-2"
        >
          <span class="text-color fs-medium fw-bold flex-center">
            Ton Wallet Connect
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
            <w3m-button />
          </div>
          <div v-if="address" class="col-6 px-1">
            <div
              @click="switchAccount()"
              class="wallet_button flex-center rounded-2 box-shadow p-2"
            >
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
            <input
              class="w-full text-color fs-large fw-bold mt-1"
              value="0"
              v-model.number="amount"
              @keypress="isNumber($event)"
              type="number"
            />
          </div>
          <div class="flex-center col-6">
            <div class="col-3 bg-card mr-1 flex-center rounded-2 box-shadow p-1">
              <img width="35px" src="@/assets/images/icon/ethereum.png" alt="" />
            </div>

            <div
              @click="sendTransaction"
              class="col-10 wallet_button flex-center rounded-2 box-shadow p-2"
            >
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
import { TON_WALLET_BOT_LINK } from "@/constants/configuration";
import EthersService from "@/extensions/ethExtension";
import { formatNumber } from "@/extensions/numberExtension";
import { ref } from "vue";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
import { mainnet, arbitrum } from "viem/chains";
import { reconnect } from "@wagmi/core";

const address = ref("");
const balance = ref(0.0);
const amount = ref(0);

const projectId = "4fd0154d93f56d70fe1bbe05f6174944";

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

reconnect(config);

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

const isNumber = async (evt) => {
  const keysAllowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  const keyPressed = evt.key;
  if (!keysAllowed.includes(keyPressed)) {
    evt.preventDefault();
  }
};

const sendTransaction = async () => {
  if (address.value) {
    const ethersService = new EthersService();
    await ethersService.sendTransaction(
      address.value,
      address.value,
      amount.value.toString()
    );
  }
};

const tonWalletConnect = () => {
  window.Telegram.WebApp.openTelegramLink(TON_WALLET_BOT_LINK);
};
</script>

<script>
export default {
  name: "WalletView",
  methods: {
    formatNumber(amount) {
      return formatNumber(amount);
    },
  },

  components: {},
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
