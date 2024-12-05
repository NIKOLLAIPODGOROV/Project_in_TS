import config from "../config/config";
import {UserInfoType} from "../types/user-info.type";

export class AuthUtils {
   public static accessTokenKey:string = 'accessToken';
   public static refreshTokenKey:string = 'refreshToken';
   public static userInfoTokenKey:string = 'userInfo';

   public static setAuthInfo(accessToken, refreshToken, userInfo:UserInfoType | null = null):void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

   public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }


   public static getAuthInfo(key:string | null): string | { [p: string]: string } {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }

   public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | { [p: string]: string } = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify( {refreshToken: refreshToken}),
            });

            if (response && response.status === 200) {
                const tokensResponse = await response.json();
                if (tokensResponse && !tokensResponse.error) {
                    this.setAuthInfo(
                        tokensResponse.tokens.accessToken,
                        tokensResponse.tokens.refreshToken
                    );

                    result = true;
                    return result;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }
        return result;
    }
}


