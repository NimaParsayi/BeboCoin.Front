import Index from '@/views/Index';
import Game from '@/views/Game/Game';
import Boost from '@/views/Game/Boost';
import League from '@/views/Game/League';
import Earn from '@/views/Game/Earn';
import Wallet from '@/views/Wallet/Wallet';
import WalletConnect from '@/views/Wallet/WalletConnect';
import State from '@/views/Game/State';
import Friend from '@/views/Game/Friend';
import Group from '@/views/Group/Group';
import ChallengeDetail from '@/views/Challenge/Detail';
import GroupDetail from '@/views/Group/GroupDetail';

import NProgress from 'nprogress';

import { createRouter, createWebHistory } from 'vue-router';
import { requestSignIn } from '@/stores/commonStore';

const routes = [
    {
        path: '/',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '/',
                component: Index
            },
        ]
    },
    {
        path: '/game',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'start',
                component: Game
            },
            {
                path: 'state',
                component: State
            },
            {
                path: 'league',
                component: League
            },
            {
                path: 'boost',
                component: Boost
            },
            {
                path: 'frens',
                component: Friend
            },
            {
                path: 'earn',
                component: Earn
            },

        ]
    },
    {
        path: '/group',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'squad',
                component: Group
            },
            {
                path: 'detail/:id',
                component: GroupDetail
            },
        ]
    },
    {
        path: '/challenge',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: ':id',
                component: ChallengeDetail
            },
        ]
    },
    {
        path: '/wallet',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '',
                component: Wallet
            },
        ]
    },
    {
        path: '/walletconnect',
        // meta: {
        //     requiresAuth: true
        // },
        children: [
            {
                path: '',
                component: WalletConnect
            },
        ]
    },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
    NProgress.start();

    const sign = window.Telegram.WebApp.initData
    console.log(sign);

    if (to.meta.requiresAuth) {
        if (to.path !== '/') {
            window.Telegram.WebView.postEvent('web_app_setup_back_button', false, { is_visible: true });
        } else {
            window.Telegram.WebView.postEvent('web_app_setup_back_button', false, { is_visible: false });
        }
        window.Telegram.WebView.onEvent('back_button_pressed', () => {
            router.go(-1);
        })
        requestSignIn(sign, next);
    }
    else next();

});
router.afterEach(() => {
    NProgress.done()
})
export default router;