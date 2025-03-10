import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import dateFormat from "dateformat";
import {OurChartsUtils} from "../utils/our-charts-utils";
import {RequestType} from "../types/request.type";

export class Index {
    public showIncomeChartElement: HTMLElement | null;
    readonly showExpensesChartElement: HTMLElement | null;
    readonly periodTodayElement!: HTMLInputElement | null;
    readonly periodWeekElement!: HTMLInputElement | null;
    readonly periodMonthElement!: HTMLInputElement | null;
    readonly periodYearElement!: HTMLInputElement | null;
    readonly periodAllElement!: HTMLInputElement | null;
    readonly periodIntervalElement!: HTMLInputElement | null;

    public openNewRoute: (url: string) => Promise<void>;
    public ourOperations: any;
    public OurChartsUtils: any;
    public chartExpenses: any;
    public chartIncome: any;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.ourOperations = null;
        this.OurChartsUtils = OurChartsUtils;
        this.chartExpenses = null;
        this.chartIncome = null;
        this.showIncomeChartElement = null;
        this.showExpensesChartElement = null;

        let token: string | { [p: string]: string | null } | null = AuthUtils.getAuthInfo('accessToken');

        if (!token) {
           window.location.href = '/login';
           
            // return this.openNewRoute('/login');
        }

        this.showIncomeChartElement = document.getElementById('ourIncome');
        this.showExpensesChartElement = document.getElementById('ourExpenses');

        this.periodTodayElement = document.getElementById('today') as HTMLInputElement;
        this.periodWeekElement = document.getElementById('week') as HTMLInputElement;
        this.periodMonthElement = document.getElementById('month') as HTMLInputElement;
        this.periodYearElement = document.getElementById('year') as HTMLInputElement;
        this.periodAllElement = document.getElementById('all') as HTMLInputElement;
        this.periodIntervalElement = document.getElementById('interval') as HTMLInputElement;
        if (!this.periodTodayElement || !this.periodWeekElement || !this.periodMonthElement ||
            !this.periodYearElement || !this.periodAllElement || !this.periodIntervalElement) {
            return
        }
        this.periodTodayElement.addEventListener('click', this.getPeriodToday.bind(this));
        this.periodWeekElement.addEventListener('click', this.getPeriodWeek.bind(this));
        this.periodMonthElement.addEventListener('click', this.getPeriodMonth.bind(this));
        this.periodYearElement.addEventListener('click', this.getPeriodYear.bind(this));
        this.periodAllElement.addEventListener('click', this.getPeriodAll.bind(this));
        this.periodIntervalElement.addEventListener('click', this.getPeriodInterval.bind(this));

        this.getOperations().then();
    }

    private removeActiveClass(): void {
        const btns: NodeListOf<Element> = document.querySelectorAll('.ourPeriod');
        btns.forEach((btn): void => {
            btn.classList.remove('active')
        })
    }

    public getPeriodToday(): void {
        let today: string = dateFormat(new Date(), 'isoDate');
        const params: string = `interval&dateFrom=${today}&dateTo=${today}`;
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    public getPeriodWeek(): void {
        const params: string = 'week';
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    public getPeriodMonth(): void {
        const params: string = 'month';
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    public getPeriodYear(): void {
        const params: string = 'year';
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    public getPeriodAll(): void {
        const params: string = 'all';
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    public getPeriodInterval(): void {
        this.removeActiveClass();

        const dateFromElement: HTMLElement | null | any = document.getElementById('dateFrom');
        const dateToElement: HTMLElement | null | any = document.getElementById('dateTo');

        if (!dateFromElement && typeof dateFromElement === 'object'
            || !dateToElement && typeof dateToElement === 'object') {
            window.location.href = '/';
            return
        }

        const params: string = `interval&dateFrom=${dateFromElement.value}&dateTo=${dateToElement.value}`;

        this.getOperations(params).then();
    }

    private async getOperations(params?: string): Promise<any> {
        if (!params) {
            let today: string = dateFormat(new Date(), 'isoDate');

            params = `interval&dateFrom=${today}&dateTo=${today}`;

        }

        let result: RequestType[] | any = await HttpUtils.request('/operations?period=' + params);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (!result) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }
        this.ourOperations = result.response;
        await this.showOurCharts(this.ourOperations);

        return this.ourOperations;
    }


    private async showOurCharts(data: any): Promise<void> {
        this.chartIncome = new OurChartsUtils(this.ourOperations);
        this.chartExpenses = new OurChartsUtils(this.ourOperations);
    }
}




