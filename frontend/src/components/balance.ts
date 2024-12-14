import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import {RequestType} from "../types/request.type";

export class Balance {
    public openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        const balanceElement: HTMLElement | null = document.getElementById('balance');
        this.openNewRoute = openNewRoute;
        let token: string | null | { [p: string]: string | null } = AuthUtils.getAuthInfo('accessToken');
        if (!token) {
            return;
        }
        if (!balanceElement) {
            return
        }

        balanceElement.addEventListener('click', this.showBalance.bind(this));

        this.getBalance().then();
    }

    async getBalance(): Promise<void> {

        const result: RequestType = await HttpUtils.request('/balance');

        if (!result) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку');
        }

        if (typeof result.respone !== 'object') {
            return;
        }
        let balance: any = result.response;
        this.showBalance(balance);
    }

    showBalance(balance: any): void {
        const balanceElement: HTMLElement | null = document.getElementById('balance');
        if (!balanceElement) {
            return
        }
        balanceElement.innerText = balance.balance;
    }
}