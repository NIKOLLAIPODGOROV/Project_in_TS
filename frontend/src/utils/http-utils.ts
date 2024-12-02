import config from "../config/config.js"
import {AuthUtils} from "./auth-utils.js";

export class HttpUtils {

    static async request(url, method = 'GET', useAuth= true , body = null ) {
        const result = {
            error: false,
            response: null,
        };

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let token = null;

        if (useAuth) {
            token = localStorage.getItem(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.host + url,params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    //1 - токена нет
                    result.redirect = '/login';
                } else {
                    //2 - токен устарел/не валидный (надо обновить)
                    const updateTokenResult =  await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //запрос повторно
                        return await this.request(url,method,useAuth,body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
            throw new Error();
        }

        return result;
    }
}