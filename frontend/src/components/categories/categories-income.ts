import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {RequestType} from "../../types/request.type";
import {ResultResponseType} from "../../types/result-response.type";

export class CategoriesIncome {
    readonly contentDescriptionElement!: HTMLElement | null;
    public categoryOriginalData: any[] | any;
    public openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.categoryOriginalData = [];
        this.openNewRoute = openNewRoute;
        let token: string | null | { [p: string]: string | null } = AuthUtils.getAuthInfo('accessToken');
        if (!token) {
            window.location.href = '/';
            return;
        }
        this.getCategory().then();
        this.contentDescriptionElement = document.getElementById('content-description');
    }

    private async getCategory(): Promise<void> {

        const result: RequestType = await HttpUtils.request('/categories/income');

        if (!result) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }
        this.categoryOriginalData = result.response;
        this.showCategory();
    }

   private showCategory(): void {

        for (let i: number = 0; i < this.categoryOriginalData.length; i++) {

            const cardFirstRowElement: HTMLDivElement = document.createElement('div');
            const cardCategoryElement: HTMLDivElement = document.createElement('div');
            const cardBodyCategoryElement: HTMLDivElement = document.createElement('div');
            const cardTitleCategoryElement: HTMLHeadingElement = document.createElement('h3');
            const contentButtonsElement: HTMLDivElement = document.createElement('div');
            const updateButtonElement: HTMLAnchorElement = document.createElement('a');
            const deleteButtonElement: HTMLAnchorElement = document.createElement('a');
            const cardSecondRowElement: HTMLDivElement = document.createElement('div');

            cardFirstRowElement.className = 'content-first-row';
            cardFirstRowElement.classList.add('d-flex', 'flex-row', 'gap-3',);
            cardCategoryElement.className = 'card';
            cardCategoryElement.style.width = '352px';
            cardCategoryElement.style.height = '121px';
            cardBodyCategoryElement.className = 'card-body';
            cardTitleCategoryElement.className = 'card-title';
            cardTitleCategoryElement.setAttribute('id', 'card-title');
            cardTitleCategoryElement.classList.add('mb-3');
            cardTitleCategoryElement.innerText = this.categoryOriginalData[i].title;
            contentButtonsElement.className = 'content-buttons';
            contentButtonsElement.classList.add('btn', 'd-flex', 'flex-row', 'gap-2');
            updateButtonElement.className = 'update-button';
            updateButtonElement.setAttribute('type', 'button');
            updateButtonElement.setAttribute('href', '/edit-categories-income?id=' + this.categoryOriginalData[i].id);
            updateButtonElement.classList.add('btn', 'btn-primary', 'edit-link');
            updateButtonElement.innerHTML = 'button';
            updateButtonElement.innerText = 'Редактировать';
            deleteButtonElement.className = 'delete-button';
            deleteButtonElement.setAttribute('type', 'button');
            deleteButtonElement.innerHTML = 'button';
            deleteButtonElement.classList.add('btn', 'btn-danger', 'mx-2');
            deleteButtonElement.innerText = 'Удалить';
            cardSecondRowElement.className = 'content-second-row';
            cardSecondRowElement.classList.add('d-flex', 'flex-row', 'gap-3', 'mt-3');

            if (!this.contentDescriptionElement) {
                window.location.href = '/';
                return
            }

            this.contentDescriptionElement.appendChild(cardFirstRowElement);
            cardFirstRowElement.appendChild(cardCategoryElement);
            cardCategoryElement.appendChild(cardBodyCategoryElement);
            cardBodyCategoryElement.appendChild(cardTitleCategoryElement);
            cardBodyCategoryElement.appendChild(contentButtonsElement);
            cardBodyCategoryElement.appendChild(updateButtonElement);
            cardBodyCategoryElement.appendChild(deleteButtonElement);
            deleteButtonElement.addEventListener('click', (): void => {
                this.openPopup(this.categoryOriginalData[i].id);
            });
        }
    }

   private openPopup(id: any): void {
        const popupElement: HTMLElement | null = document.getElementById('popup-container');
        if (!popupElement) {
            window.location.href = '/';
            return
        }
        popupElement.classList.remove('d-none');
        const deleteLinkElement: HTMLElement | null = document.getElementById('delete-link');
        if (!deleteLinkElement) {
            return
        }

        deleteLinkElement.addEventListener('click', (): void => {
            this.deleteCategory(id).then();
            popupElement.classList.add('d-none');
        });
        const canceledElement: HTMLElement | null = document.getElementById('canceled');
        if (!canceledElement) {
            return
        }

        canceledElement.addEventListener('click', this.showCategories.bind(this));
    }

    private async deleteCategory(id: any): Promise<any> {
        const result: ResultResponseType = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (!result.response) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }
        return window.location.href = '/income';
        // return this.openNewRoute('/income');
    }

   private showCategories(): void {
        const popupElement: HTMLElement | null = document.getElementById('popup-container');
        if (!popupElement) {
            window.location.href = '/expense';
            return
        }
        popupElement.classList.add('d-none');
        window.location.href = '/income';
       // this.openNewRoute('/income');
    }
}
