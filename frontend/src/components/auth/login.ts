
import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {RouteType} from "../../types/route.type";
import {UserInfoType} from "../../types/user-info.type";
import {ResultResponseType} from "../../types/result-response.type";


export class Login {
    readonly emailElement: HTMLElement | null;
    readonly passwordElement: HTMLElement | null;
    readonly rememberMeElement: HTMLElement | null;
    readonly commonErrorElement: HTMLElement | null;

    public openNewRoute:  RouteType[];

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');

       document.getElementById('process-button').addEventListener('click', this.login.bind(this));

    }

   public validateForm():void {
        let isValid: boolean = true;

        if (!this.emailElement || !this.passwordElement) {
            return
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }


    async login():Promise<void> {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {

            if (!this.emailElement || !this.passwordElement) {
                return
            }

            const result: ResultResponseType = await HttpUtils.request('/login', 'POST', false,{
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            });

            if (result.error && result.message) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                name: result.response.user.name,
                lastName: result.response.user.lastName,
                id: result.response.user.id,
            });

            this.openNewRoute('/');
        }
    }
}

