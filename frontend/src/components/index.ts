import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import dateFormat from "dateformat";
import {OurChartsUtils} from "../utils/our-charts-utils";

export class Index {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.ourOperations = null;
        this.OurChartsUtils = OurChartsUtils;
        this.chartExpenses = null;
        this.chartIncome = null;

        let token = AuthUtils.getAuthInfo('accessToken');

        if (!token) {
            return this.openNewRoute('/login');
        }

        this.showIncomeChartElement = document.getElementById('ourIncome');
        this.showExpensesChartElement = document.getElementById('ourExpenses');

        this.periodTodayElement = document.getElementById('today');
        this.periodWeekElement = document.getElementById('week');
        this.periodMonthElement = document.getElementById('month');
        this.periodYearElement = document.getElementById('year');
        this.periodAllElement = document.getElementById('all');
        this.periodIntervalElement = document.getElementById('interval');

        this.periodTodayElement.addEventListener('click', this.getPeriodToday.bind(this));
        this.periodWeekElement.addEventListener('click', this.getPeriodWeek.bind(this));
        this.periodMonthElement.addEventListener('click', this.getPeriodMonth.bind(this));
        this.periodYearElement.addEventListener('click', this.getPeriodYear.bind(this));
        this.periodAllElement.addEventListener('click', this.getPeriodAll.bind(this));
        this.periodIntervalElement.addEventListener('click', this.getPeriodInterval.bind(this));

        this.getOperations().then();
    }

    removeActiveClass() {
        const btns = document.querySelectorAll('.ourPeriod');
        btns.forEach((btn) => {
            btn.classList.remove('active')
        })
    }

    getPeriodToday() {
        let today = dateFormat(new Date(), 'isoDate');
        const params = `interval&dateFrom=${today}&dateTo=${today}`;
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    getPeriodWeek() {
        const params = 'week';
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    getPeriodMonth() {
        const params = 'month';
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    getPeriodYear() {
        const params = 'year';
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    getPeriodAll() {
        const params = 'all';
        this.removeActiveClass();
        this.getOperations(params).then();
    }

    getPeriodInterval() {
        this.removeActiveClass();

        const dateFromElement = document.getElementById('dateFrom');
        const dateToElement = document.getElementById('dateTo');

        const params = `interval&dateFrom=${dateFromElement.value}&dateTo=${dateToElement.value}`;

        this.getOperations(params).then();
    }

    async getOperations(params) {
        if (!params) {
            let today = dateFormat(new Date(), 'isoDate');

            params = `interval&dateFrom=${today}&dateTo=${today}`;

        }

        let result = await HttpUtils.request('/operations?period=' + params);

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


   async showOurCharts(data) {

        this.chartIncome = new OurChartsUtils(this.ourOperations);
        this.chartExpenses = new OurChartsUtils(this.ourOperations);

    }
}




