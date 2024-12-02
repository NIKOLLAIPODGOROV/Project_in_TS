
import {HttpUtils} from "../utils/http-utils";
import {UrlUtils} from "../utils/url-utils";

export class EditCategoriesExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('updateButton').addEventListener('click', this.updateCategory.bind(this));

        this.titleCategoryInputElement = document.getElementById('titleCategoryInput');

        this.getCategory().then();
    }

    async getCategory() {
        const id = UrlUtils.getUrlParam('id');
        const result =  await HttpUtils.request('/categories/expense/' + id );
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (!result.response) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        this.categoryOriginalData = result.response;
        if (this.titleCategoryInputElement.value !== this.categoryOriginalData.title) {
            this.titleCategoryInputElement.value = this.categoryOriginalData.title;
        }
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

    async updateCategory(e) {
        e.preventDefault();
        const id = UrlUtils.getUrlParam('id');
        if (this.validateForm()) {
            let changedData = {title: null,};

            if (Object.keys(changedData).length > 0) {
                if (this.titleCategoryInputElement.value !== this.categoryOriginalData ) {
                    changedData.title = this.titleCategoryInputElement.value;
                    changedData.id = this.categoryOriginalData.id;
                }

                let result = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (!result.response) {
                    return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
                }
                return this.openNewRoute('/expense');
            }
        }
    }
}