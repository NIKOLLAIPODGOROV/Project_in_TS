import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils.js";
import dateFormat from "dateformat";
import {RouteType} from "../types/route.type";
import {RequestType} from "../types/request.type";

export class Operations {
    readonly recordsElement!: HTMLElement | null;
    readonly periodTodayElement!: HTMLInputElement | null;
    readonly periodWeekElement!: HTMLInputElement | null;
    readonly periodMonthElement!: HTMLInputElement | null;
    readonly periodYearElement!: HTMLInputElement | null;
    readonly periodAllElement!: HTMLInputElement | null;
    readonly periodIntervalElement!: HTMLInputElement | null;

    public openNewRoute: RouteType[];
    public ourOperations: any;

    constructor(openNewRoute: RouteType[]) {
        this.openNewRoute = openNewRoute;
        this.ourOperations = null;
        let token: string | { [p: string]: string | null } | null = localStorage.getItem(AuthUtils.accessTokenKey);
        if (!token) {
            window.location.href = '/login';
            return
        }

        this.recordsElement = document.getElementById('records');
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
        });
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

        const dateFromElement: HTMLInputElement | null | any = document.getElementById('dateFrom') as HTMLInputElement;
        const dateToElement: HTMLInputElement | null | any = document.getElementById('dateTo') as HTMLInputElement;
       if (!dateFromElement && typeof dateFromElement === 'object' || !dateToElement && typeof dateToElement === 'object') {
           window.location.href = '/';
           return
       }
/*
        const getDatesArray: Date | null = (dateFromElement: { value: string | number | Date; setDate: (arg0: any) => void; getDate: () => number; }, dateToElement: { value: number; }) => {
            const arr = [];
            while (dateFromElement.value <= dateToElement.value) {
                arr.push(new Date(dateFromElement.value));
                dateFromElement.setDate(dateFromElement.getDate() + 1);
            }
            return arr;
        };
*/
        const params: string = `interval&dateFrom=${dateFromElement.value}&dateTo=${dateToElement.value}`;

        this.getOperations(params).then();
    }

   private async getOperations(params: string | undefined): Promise<any> {
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
        await this.showRecord(this.ourOperations);

        return this.ourOperations;
    }

   private async showRecord(): Promise<any> {
        if (!this.recordsElement) {
            return
        }
        this.recordsElement.innerHTML = '';
        if (this.ourOperations.length > 0) {
            for (let i: number | null = 0; i < this.ourOperations.length; i++) {
                this.ourOperations.category_id = this.ourOperations[i].id;
                this.ourOperations.type = this.ourOperations[i].type;
                this.ourOperations.amount = this.ourOperations[i].amount;
                this.ourOperations.category = this.ourOperations[i].category;
                this.ourOperations.date = this.ourOperations[i].date;
                const trElement: HTMLTableRowElement | null = document.createElement('tr');
                if (!trElement) {
                    return
                }
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

   private openPopup(id:any): void {
        const popupElement: HTMLElement | null = document.getElementById('popup-container');
        if (!popupElement) {
            return
        }
        popupElement.classList.remove('d-none');
        const deleteLinkElement: HTMLElement | null = document.getElementById('delete-link');
        if (!deleteLinkElement) {
            return
        }
        deleteLinkElement.addEventListener('click', async () => {
            await this.deleteOperation(id)
            popupElement.classList.add('d-none');
        });
        const canceledElement: HTMLElement | null = document.getElementById('canceled');
        if (!canceledElement) {
            return
        }
        canceledElement.addEventListener('click', this.showRecords.bind(this));
    }

   private async deleteOperation(id:any): Promise<any> {
        const result:RequestType = await HttpUtils.request('/operations/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (!result.response) {
            return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
        }
        return this.openNewRoute('/operations');
    }

   private showRecords(): string | undefined {
        const popupElement: HTMLElement | null = document.getElementById('popup-container');
       if (!popupElement) {
           return
       }
        popupElement.classList.add('d-none');
        return window.location.href = '/operations';
    }
}