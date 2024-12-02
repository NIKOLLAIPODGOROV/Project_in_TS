import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Balance {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        let  token = AuthUtils.getAuthInfo('accessToken');
        if (!token) {
            return this.openNewRoute('/login');
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