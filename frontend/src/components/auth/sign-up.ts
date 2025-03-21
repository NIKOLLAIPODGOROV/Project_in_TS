import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ResultResponseType} from "../../types/result-response.type";

export class SignUp {
    readonly fullNameElement!: HTMLInputElement | null;
    readonly emailElement!: HTMLInputElement | null;
    readonly passwordElement!: HTMLInputElement | null;
    readonly passwordRepeatElement!: HTMLInputElement | null;
    readonly commonErrorElement!: HTMLElement | null;
    readonly processButtonElement!: HTMLElement | null;
    public openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: OmitThisParameter<(url: string) => Promise<void>>) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo('accessToken')) {
            window.location.href = '/login';
            return;
        }
        this.processButtonElement = document.getElementById('process-button');
        this.fullNameElement = document.getElementById('full-name') as HTMLInputElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error');

        if (!this.processButtonElement) {
            return
        }
        this.processButtonElement.addEventListener('click', this.signUp.bind(this));
    }

   public validateForm(): boolean | string{
        let isValid: boolean = true;
        if (!this.fullNameElement || !this.emailElement ||
            !this.passwordElement || !this.passwordRepeatElement) {
               return window.location.href = '/login';
            
        }

        if (this.fullNameElement.value && this.fullNameElement.value.match(/^[А-ЯЁ][а-яё]* [А-ЯЁ][а-яё]*$/)) {
            this.fullNameElement.classList.remove('is-invalid');
        } else {
            this.fullNameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    public async signUp(): Promise<void> {

        if (!this.commonErrorElement) {
            return;
        }
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm() && this.fullNameElement && this.emailElement && this.passwordElement && this.passwordRepeatElement) {
            const result: ResultResponseType = await HttpUtils.request('/signup', 'POST', false, {
                name: this.fullNameElement.value.split(' ').slice(0, 1).join(' '),
                lastName: this.fullNameElement.value.split(' ').slice(1).join(' '),
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });

            if (result.error || !result.response || result.response && (!result.response.user.id || !result.response.user.email || !result.response.user.name || !result.response.user.lastName)) {
                this.commonErrorElement.style.display = 'block';
                return;
            }
            const resultLogin = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: false
            });

            if (resultLogin.error || !resultLogin.response) {
                window.location.href = '/login';
                // this.openNewRoute('/login');
            } else {
                AuthUtils.setAuthInfo(
                    resultLogin.response.tokens.accessToken,
                    resultLogin.response.tokens.refreshToken,
                    {
                        id: result.response.user.id,
                        email: result.response.user.email,
                        name: result.response.user.name,
                        lastName: result.response.user.lastName
                    });
                window.location.href = '/';
                //  this.openNewRoute('/');
            }
        }
    }
}

