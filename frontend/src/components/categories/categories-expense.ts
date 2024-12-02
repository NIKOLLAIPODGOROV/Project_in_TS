import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";

export class CategoriesExpense {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        let token = AuthUtils.getAuthInfo('accessToken');
        if (!token) {
            return this.openNewRoute('/');
        }
        document.getElementsByClassName('edit-link').href = '/edit-categories-income';
        document.getElementsByClassName('delete-link').href = '/categories-income-delete';

       document.getElementById('delete-link').addEventListener('click', () => {
           document.getElementById('popup-container').style.display = 'd-block';
       })

        this.getCategory().then();

        this.contentDescriptionElement = document.getElementById('content-description');
    }

    async getCategory() {

        const result = await HttpUtils.request('/categories/expense');

        if (!result) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }
        this.categoryOriginalData = result.response;
        await this.showCategory(this.categoryOriginalData);
    }

    showCategory() {
        const contentDescriptionElement = document.getElementById('content-description');

        for (let i = 0; i < this.categoryOriginalData.length; i++) {
            this.categoryOriginalData.id = this.categoryOriginalData[i].id;

            const cardFirstRowElement = document.createElement('div');
            const cardCategoryElement = document.createElement('div');
            const cardBodyCategoryElement = document.createElement('div');
            const cardTitleCategoryElement = document.createElement('h3');
            const contentButtonsElement = document.createElement('div');
            const updateButtonElement = document.createElement('a');
            const deleteButtonElement = document.createElement('a');
            const cardSecondRowElement = document.createElement('div');

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
    openPopup(id) {
        const popupElement = document.getElementById('popup-container');
        popupElement.classList.remove('d-none');
        document.getElementById('delete-link').addEventListener('click', () => {
            this.deleteCategory(id);
            popupElement.classList.add('d-none');
        });
        document.getElementById('canceled').addEventListener('click', this.showCategories.bind(this));
    }
    async deleteCategory(id) {
        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (!result.response) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }
        return this.openNewRoute('/expense');
    }

    showCategories() {
        const popupElement = document.getElementById('popup-container');
        popupElement.classList.add('d-none');
        this.openNewRoute('/expense');
    }
}