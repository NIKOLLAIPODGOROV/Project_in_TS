import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {RouteType} from "../../types/route.type";

export class SignUp {
   private fullNameElement: HTMLElement | null;
   private emailElement: HTMLElement | null;
   private passwordElement: HTMLElement | null;
   private passwordRepeatElement: HTMLElement | null;
   private commonErrorElement: HTMLElement | null;
    public openNewRoute: RouteType[];

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo('accessToken')) {
            if (typeof this.openNewRoute === 'function') {
                return this.openNewRoute('/login');
            }

        this.fullNameElement = document.getElementById('full-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid: boolean = true;

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

   public async signUp() {
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm()) {
            const result = await HttpUtils.request('/signup', 'POST', false, {
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
                this.openNewRoute('/login');
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
                this.openNewRoute('/');
            }
        }
    }
}

