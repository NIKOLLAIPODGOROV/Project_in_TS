import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {RouteType} from "../../types/route.type";
import {RequestType} from "../../types/request.type";

export class CategoriesExpense {
   private contentDescriptionElement: HTMLElement | null,
    public openNewRoute:  RouteType[];
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        let token: string | {[p: string]: string} = AuthUtils.getAuthInfo('accessToken');
        if (!token) {
            return
        }
        this.getCategory().then();
        this.contentDescriptionElement = document.getElementById('content-description');
    }

   private async getCategory(): Promise<void> {

        const result: RequestType = await HttpUtils.request('/categories/expense');

        if (!result) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }
        this.categoryOriginalData = result.response;
        await this.showCategory(this.categoryOriginalData);
    }

    showCategory(): void {

        for (let i: number = 0; i < this.categoryOriginalData.length; i++) {

            const cardFirstRowElement: HTMLDivElement = document.createElement('div');
            const cardCategoryElement: HTMLDivElement = document.createElement('div');
            const cardBodyCategoryElement: HTMLDivElement = document.createElement('div');
            const cardTitleCategoryElement: HTMLDivElement = document.createElement('h3');
            const contentButtonsElement: HTMLDivElement = document.createElement('div');
            const updateButtonElement: HTMLAnchorElement = document.createElement('a');
            const deleteButtonElement: HTMLAnchorElement = document.createElement('a');
            const cardSecondRowElement: HTMLDivElement = document.createElement('div');

            cardFirstRowElement.className = 'content-first-row';
            cardFirstRowElement.classList.add('d-flex', 'flex-row', 'gap-3',);
            cardCategoryElement.className = 'card';
            cardCategoryElement.style = 'width: 352px', 'height: 121px';
            cardBodyCategoryElement.className = 'card-body';
            cardTitleCategoryElement.className = 'card-title';
            cardTitleCategoryElement.classList.add('mb-3');
            cardTitleCategoryElement.innerText = this.categoryOriginalData[i].title;
            contentButtonsElement.className = 'content-buttons';
            contentButtonsElement.classList.add('btn', 'd-flex', 'flex-row', 'gap-2');
            updateButtonElement.className = 'update-button';
            updateButtonElement.setAttribute('type', 'button');
            updateButtonElement.setAttribute('id', 'updateButton');
            updateButtonElement.setAttribute('href', '/edit-categories-expense?id='+ this.categoryOriginalData[i].id);
            updateButtonElement.classList.add('btn', 'btn-primary', 'edit-link');
            updateButtonElement.innerHTML = 'button';
            updateButtonElement.innerText = 'Редактировать';
            deleteButtonElement.className = 'delete-button';
            deleteButtonElement.setAttribute('type', 'button');
            deleteButtonElement.setAttribute('id', 'deleteButton');
            deleteButtonElement.innerHTML = 'button';
            deleteButtonElement.classList.add('btn', 'btn-danger', 'delete-link', 'mx-2');
            deleteButtonElement.innerText = 'Удалить';
            cardSecondRowElement.className = 'content-second-row';
            cardSecondRowElement.classList.add('d-flex', 'flex-row', 'gap-3', 'mt-3');

            this.contentDescriptionElement.appendChild(cardFirstRowElement);
            cardFirstRowElement.appendChild(cardCategoryElement);
            cardCategoryElement.appendChild(cardBodyCategoryElement);
            cardBodyCategoryElement.appendChild(cardTitleCategoryElement);
            cardBodyCategoryElement.appendChild(contentButtonsElement);
            cardBodyCategoryElement.appendChild(updateButtonElement);
            cardBodyCategoryElement.appendChild(deleteButtonElement);
            deleteButtonElement.addEventListener('click',  () => {
                this.openPopup(this.categoryOriginalData[i].id);
            });
        }
    }
    openPopup(id): void {
        const popupElement: HTMLElement | null = document.getElementById('popup-container');
        popupElement.classList.remove('d-none');
        document.getElementById('delete-link').addEventListener('click', () => {
            this.deleteCategory(id).then();
            popupElement.classList.add('d-none');
        });
        document.getElementById('canceled').addEventListener('click', this.showCategories.bind(this));
    }
   private async deleteCategory(id): Promise<any> {
        const result: RequestType = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (!result.response) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }
        return this.openNewRoute('/expense');
    }

    showCategories(): void {
        const popupElement: HTMLElement | null = document.getElementById('popup-container');
        popupElement.classList.add('d-none');
        this.openNewRoute('/expense');
    }
}