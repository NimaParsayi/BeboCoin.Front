import { BASE_URL } from "../constants/configuration";
import NProgress from 'nprogress';
import https from 'https'

const agent = new https.Agent({ rejectUnauthorized: false });

export const requestPost = (url, data) => {
    NProgress.start();
    return fetch(BASE_URL + url, {
        method: 'POST',
        headers: {
            "Authorization": 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        agent
    }).then(data => {
        NProgress.done();

        if (data.status === 401) {
            localStorage.removeItem("token")
            window.location.reload();
        }

        if (data.ok)
            return data.json()
        else return null;
    }).catch(err => {
        console.log(err)
        NProgress.done();
        return null
    });
}
export const requestGet = (url) => {
    NProgress.start();
    return fetch(BASE_URL + url, {
        headers: {
            "Authorization": 'Bearer ' + getToken(),
            'Content-Type': 'application/json',
        },
        agent
    })
        .then(response => {
            NProgress.done();

            if (response.status === 401) {
                localStorage.removeItem("token")
                window.location.reload();
            }
            if (!response.ok) return null;

            return response.json()
        }).catch(err => {
            console.log(err)
            NProgress.done();
            return null
        });
}
export const getToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const parseJson = JSON.parse(token);
        return parseJson["accessToken"];
    }
    return "";
}
export const requestSignIn = (sign, next) => {
    if (IsAuthenticated())
        next();
    else requestPost("/account/SignIn", { webAppData: sign }).then(data => {
        if (!data) return;
        localStorage.setItem("token", JSON.stringify(data.result))
        next()

    }).catch(err => console.log(err));
}

export const IsAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return token
    }
    return false;
}