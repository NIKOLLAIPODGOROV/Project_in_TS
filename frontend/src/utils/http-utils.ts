import config from "../config/config"
import {AuthUtils} from "./auth-utils";

export class HttpUtils {

   public static async request(url: string, method: string = 'GET', useAuth: boolean = true , body: any = null ): Promise<any> {
        const result:{error:boolean, response:null} = {
            error: false,
            response: null,
        };

        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let token: string | null = null;

        if (useAuth) {
            token = localStorage.getItem(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;
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
                    return null;
                } else {
                    //2 - токен устарел/не валидный (надо обновить)
                    const updateTokenResult: boolean =  await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //запрос повторно
                        return await this.request(url,method,useAuth,body);
                    } else {
                        return null;
                    }
                }
            }
            throw new Error(response.statusText);
        }

        return result;
    }
}