import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {RouteType} from "../../types/route.type";
import {Router} from "../../router";

export class Logout {
    public openNewRoute: RouteType[];

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            if (typeof this.openNewRoute === 'function') {
                return this.openNewRoute('/login');
            }
        }

        this.logout(openNewRoute).then();
    }

    private async logout(openNewRoute): Promise<void> {
        this.openNewRoute = openNewRoute;

        await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });

        AuthUtils.removeAuthInfo();

        if (typeof this.openNewRoute === 'function') {
            this.openNewRoute('/login');
        }
    }
}




