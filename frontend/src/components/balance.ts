import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import {RouteType} from "../types/route.type";

export class Balance {
    public openNewRoute:  RouteType[];
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        let  token: string | {[p: string]: string} = AuthUtils.getAuthInfo('accessToken');
        if (!token) {
            return ;
        }
        document.getElementById('balance').addEventListener('click', this.showBalance.bind(this));
        this.getBalance().then();
    }

    async getBalance() {

        const result = await HttpUtils.request( '/balance');

        if (!result) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку');
        }

        this.showBalance(result.response);
    }

    showBalance(balance) {
        document.getElementById('balance').innerText = balance.balance;
    }
}