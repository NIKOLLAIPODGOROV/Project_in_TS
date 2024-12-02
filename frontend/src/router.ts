import {Index} from "./components/index";
import {Operations} from "./components/operations";
import {CategoriesIncome} from "./components/categories/categories-income";
import {CategoriesExpense} from "./components/categories/categories-expense";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {CreateCategoriesIncomeExpenses} from "./components/create-categories-income-expenses";
import {EditCategoriesIncomeExpenses} from "./components/edit-categories-income-expenses";
import {CreateCategoriesIncome} from "./components/create-categories-income";
import {EditCategoriesIncome} from "./components/edit-categories-income";
import {CreateCategoriesExpense} from "./components/create-categories-expense";
import {EditCategoriesExpense} from "./components/edit-categories-expense";
import {Balance} from "./components/balance";
import {AuthUtils} from "./utils/auth-utils";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    readonly layoutPageElement: HTMLElement | null;
    public profileNameElement: HTMLElement | null;
    public userName: string | null;
    public userlastName: string | null;

    private routes: RouteType[];

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.layoutPageElement = document.getElementById('sidebar');

        this.userName = null;
        this.userlastName = null;

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/layout.html',
                useLayout: './index.html',
                styles: 'bootstrap.min.css',
                load: () => {
                    new Index(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('sidebar');
                    document.body.style.height = 'auto';
                },
                styles: 'bootstrap.min.css',
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/404',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
                load: () => {
                    new Error();
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('sidebar');
                    document.body.style.height = 'auto';
                },
                styles: 'bootstrap.min.css',
            },
            {
                route: '/income',
                title: 'Приход',
                filePathTemplate: '../../templates/pages/categories/income.html',
                useLayout: './index.html',
                load: () => {
                    new CategoriesIncome(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/create-categories-income',
                title: 'Создать приход',
                filePathTemplate: '/templates/pages/create-categories-income.html',
                useLayout: './index.html',
                load: () => {
                    new CreateCategoriesIncome(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/edit-categories-income',
                title: 'Создать приход',
                filePathTemplate: './templates/pages/edit-categories-income.html',
                useLayout: './index.html',
                load: () => {
                    new EditCategoriesIncome(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/expense',
                title: 'Расход',
                filePathTemplate: '../../templates/pages/categories/expense.html',
                useLayout: './index.html',
                load: () => {
                    new CategoriesExpense(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/create-categories-expense',
                title: 'Создать расход',
                filePathTemplate: '/templates/pages/create-categories-expense.html',
                useLayout: './index.html',
                load: () => {
                    new CreateCategoriesExpense(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/edit-categories-expense',
                title: 'Создать приход',
                filePathTemplate: './templates/pages/edit-categories-expense.html',
                useLayout: './index.html',
                load: () => {
                    new EditCategoriesExpense(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/operations',
                title: 'Доходы-расходы',
                filePathTemplate: '/templates/pages/operations.html',
                useLayout: './index.html',
                load: () => {
                    new Operations(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css', 'bootstrap-icons.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/create-categories-income-expenses',
                title: 'Создать операцию доход-расход',
                filePathTemplate: '/templates/pages/create-categories-income-expenses.html',
                useLayout: './index.html',
                load: () => {
                    new CreateCategoriesIncomeExpenses(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/edit-categories-income-expenses',
                title: 'Редактировать операцию доход-расход',
                filePathTemplate: '/templates/pages/edit-categories-income-expenses.html',
                useLayout: './index.html',
                load: () => {
                    new EditCategoriesIncomeExpenses(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap.min.css'],
                scripts: ['bootstrap.min.js', 'jquery.min.js'],
            },
            {
                route: '/balance',
                title: 'Баланс',
                filePathTemplate: './templates/layout.html',
                useLayout: './index.html',
                styles: 'bootstrap.min.css',
                load: () => {
                    new Balance(this.openNewRoute.bind(this));
                }
            },
        ];
    }

    initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

   public async openNewRoute(url): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

   private async clickHandler(e): Promise<void> {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }


   private async activateRoute(e, oldRoute = null,): Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute);
            if (!currentRoute) {
                window.location.href = '/';
                return
            }

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);
       if (!newRoute) {
           window.location.href = '/';
           return
       }
        if (newRoute) {
            if (!this.titlePageElement || !this.contentPageElement || !this.profileNameElement || !this.layoutPageElement) {
                if (urlRoute === '/') {
                    return
                } else {
                    window.location.href = '/';
                    return
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (!contentBlock) {
                    window.location.href = '/';
                    return
                }
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content');
                    document.body.classList.add('sidebar');
                    this.layoutPageElement.style.display = 'block';

                    this.profileNameElement = document.getElementById('profile-name');

                    if (!this.profileNameElement){
                        window.location.href = '/';
                        return
                    }

                    if (!this.userName || !this.userlastName) {
                        let userInfo: UserInfoType = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);

                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);

                            if (userInfo.name && userInfo.lastName) {
                                if (!userInfo.name || !userInfo.lastName){

                                }
                                this.userName = userInfo.name;
                                this.userlastName = userInfo.lastName;
                            }
                        }
                    }
                    this.profileNameElement.innerText = this.userName + ' ' + this.userlastName;

                } else {
                    document.body.classList.remove('layout');
                    this.layoutPageElement.style.display = 'none';
                }
                if(!contentBlock) {
                    window.location.href = '/';
                    return
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute(null);
        }
    }
}


