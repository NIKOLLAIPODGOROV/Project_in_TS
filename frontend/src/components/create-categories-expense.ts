import {HttpUtils} from "../utils/http-utils";

export class CreateCategoriesExpense {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));
        this.titleCategoryInputElement = document.getElementById('titleCategoryInput');
        this.cardTitleInputElement = document.getElementsByClassName('card-title');
    }

    validateForm() {
        let isValid = true;

        let textInputArray = [this.titleCategoryInputElement];

        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid;
    }

    async saveCategory(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const createData = {
                title: this.titleCategoryInputElement.value,
            };

            const result = await HttpUtils.request('/categories/expense', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (!result.response) {
                return alert('Возникла ошибка при добавлении категории. Обратитесь в поддержку');
            }
            return this.openNewRoute('/expense');
        }
    }
}