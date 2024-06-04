import { BASE_URL } from "../constants/configuration";
import NProgress from 'nprogress';

export const requestPost = (url, data) => {
    NProgress.start();
    return fetch(BASE_URL + url, {
        method: 'POST',
        headers: {
            "Authorization": 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(data => {
        NProgress.done();
        if (data.ok)
            return data.json()
        else {
            window.location.reload();
            return null;
        }
    }).catch(err => {
        console.log(err);
        localStorage.removeItem("token")
        if (err.resposne.status === 401 || err.resposne.status === 501 || err.resposne.status === 400 || err.resposne.status === 503) window.location.reload();
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
        }
    })
        .then(response => {
            NProgress.done();
            if (!response.ok) {
                window.location.reload();
                return null;
            }

            return response.json()
        }).catch(err => {
            console.log(err);
            localStorage.removeItem("token")
            if (err.resposne.status === 401 || err.resposne.status === 501 || err.resposne.status === 400 || err.resposne.status === 503) window.location.reload();
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
    const submittedSign = localStorage.getItem("webAppData");
    if (submittedSign === null || submittedSign !== sign) {
        requestPost("/account/SignIn", { webAppData: sign }).then(data => {
            if (!data) return;
            localStorage.setItem("webAppData", sign)
            localStorage.setItem("token", JSON.stringify(data.result))
        }).catch(err => console.log(err));
    }
    next();
}

export const IsAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return token
    }
    return false;
}