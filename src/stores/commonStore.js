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

        if (data.status === 401) {
            localStorage.removeItem("token")
            window.location.reload();
        }

        if (data.ok)
            return data.json()
        else return null;
    }).catch(err => {
        if (err.status === 401) {
            localStorage.removeItem("token")
            window.location.reload();
        }
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
            if (response.status === 401) {
                localStorage.removeItem("token")
                window.location.reload();
            }
            if (!response.ok) return null;

            return response.json()
        }).catch(err => {
            if (err.status === 401) {
                localStorage.removeItem("token")
                window.location.reload();
            }
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