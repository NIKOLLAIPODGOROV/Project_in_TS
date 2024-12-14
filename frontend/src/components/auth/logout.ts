import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    public openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: OmitThisParameter<(url: string) => Promise<void>>) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            if (typeof this.openNewRoute === 'function') {
              window.location.href = '/login';
               // return this.openNewRoute('/login');
            }
        }

        this.logout(this.openNewRoute).then();
    }

    private async logout(openNewRoute: OmitThisParameter<(url: string) => Promise<void>>): Promise<void> {
        this.openNewRoute = openNewRoute;

        await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });

        AuthUtils.removeAuthInfo();

        if (typeof this.openNewRoute === 'function') {
            window.location.href = '/login';
           // this.openNewRoute('/login');
        }
    }
}




