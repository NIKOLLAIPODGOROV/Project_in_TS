import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils.js";
import dateFormat from "dateformat";

export class Operations {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        let token = localStorage.getItem(AuthUtils.accessTokenKey);
        if (!token) {
            return this.openNewRoute('/login');
        }

        this.recordsElement = document.getElementById('records');
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
        });
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
        const params =  'all';
        this.removeActiveClass();
          this.getOperations(params).then();
    }

    getPeriodInterval() {
        this.removeActiveClass();

        const dateFromElement = document.getElementById('dateFrom');
        const dateToElement = document.getElementById('dateTo');

        const getDatesArray = (dateFromElement, dateToElement) => {
            const arr = [];
            while (dateFromElement.value <= dateToElement.value) {
                arr.push(new Date(dateFromElement.value));
                dateFromElement.setDate(dateFromElement.getDate() + 1);
            }
            return arr;
        };

         const params = `interval&dateFrom=${dateFromElement.value}&dateTo=${dateToElement.value}`;

        this.getOperations(params).then();
    }

    async getOperations(params) {
        if (!params) {
            let today = dateFormat(new Date(), 'isoDate');

            console.log(today);
            params = `interval&dateFrom=${today}&dateTo=${today}`;

           // this.periodTodayElement.classList.add('active')
        }

        let result = await HttpUtils.request('/operations?period=' + params);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (!result) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }
        this.ourOperations = result.response;

        await this.showRecord(this.ourOperations);

        return this.ourOperations;
    }

    async showRecord() {
        this.recordsElement.innerHTML = '';
        if (this.ourOperations.length > 0) {
            for (let i = 0; i < this.ourOperations.length; i++) {
                this.ourOperations.category_id = this.ourOperations[i].id;
                this.ourOperations.type = this.ourOperations[i].type;
                this.ourOperations.amount = this.ourOperations[i].amount;
                this.ourOperations.category = this.ourOperations[i].category;
                this.ourOperations.date = this.ourOperations[i].date;
                const trElement = document.createElement('tr');
                trElement.className = 'text-center';
                trElement.style.border = 'border-top: 1px solid #DEE2E6';
                trElement.style.height = '49px';
                trElement.insertCell().innerText = i + 1;
                const tdElement = document.createElement('td');
                if (this.ourOperations[i].type === 'income') {
                    tdElement.style.color = "#198754";
                    tdElement.innerText = 'доход';
                } else if (this.ourOperations[i].type === 'expense') {
                    tdElement.style.color = "#DC3545";
                    tdElement.innerText = 'расход';
                }
                trElement.insertCell().appendChild(tdElement)
                trElement.insertCell().innerText = this.ourOperations[i].category;
                trElement.insertCell().innerText = this.ourOperations[i].amount;
                trElement.insertCell().innerHTML = this.ourOperations[i].date;
                trElement.insertCell().innerText = this.ourOperations[i].comment;
                const editLink = document.createElement('a');
                editLink.classList.add("bi", "bi-pencil-square", "text-secondary", "update-link");
                editLink.setAttribute('href', `/edit-categories-income-expenses?id=${this.ourOperations[i].id}`)
                const deleteLink = document.createElement('a');
                deleteLink.classList.add("bi", "bi-trash", "text-secondary", "delete-links");
                deleteLink.setAttribute('href', `/operations?id=${this.ourOperations[i].id}`)
                deleteLink.addEventListener('click', () => {
                    this.openPopup(this.ourOperations[i].id)
                });
                trElement.insertCell().appendChild(editLink);
                trElement.insertCell().appendChild(deleteLink);
                this.recordsElement.appendChild(trElement);
            }
        }

        return this.ourOperations;
    }

    openPopup(id) {
        const popupElement = document.getElementById('popup-container');
        popupElement.classList.remove('d-none');
        document.getElementById('delete-link').addEventListener('click', async () => {
            await this.deleteOperation(id)
            popupElement.classList.add('d-none');
        });
        document.getElementById('canceled').addEventListener('click', this.showRecords.bind(this));
    }

    async deleteOperation(id) {
        const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (!result.response) {
            return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
        }
        return this.openNewRoute('/operations');
    }

    showRecords() {
        const popupElement = document.getElementById('popup-container');
        popupElement.classList.add('d-none');
        return this.openNewRoute('/operations')
    }
}