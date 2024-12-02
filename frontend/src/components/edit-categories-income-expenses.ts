import {HttpUtils} from "../utils/http-utils";
import {UrlUtils} from "../utils/url-utils";

export class EditCategoriesIncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('updateOperation').addEventListener('click', this.updateOperation.bind(this));
        this.operationOriginalData = null;

        this.categoryTypeElement = document.getElementById('typeInput');
        this.categorySelectElement = document.getElementById('categoryInput');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');

        this.getOperation().then();
    }

    async getOperation() {
        const id = UrlUtils.getUrlParam('id');

        const result = await HttpUtils.request('/operations/' + id);
        console.log(result);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (!result.response) {
            return alert(
                'Возникла ошибка при запросе операции. Обратитесь в поддержку'
            );
        }
        this.operationOriginalData = result.response;
        console.log(this.operationOriginalData);

        if (this.operationOriginalData.type === 'income') {
            document.getElementById('income').setAttribute('selected', 'selected');
            this.categoryTypeElement.value = 'income';
        } else if (this.operationOriginalData.type === 'expense') {
            document.getElementById('expense').setAttribute('selected', 'selected');
            this.categoryTypeElement.value = 'expense';
        }

        if (this.amountInputElement.value !== this.operationOriginalData.amount) {
            this.amountInputElement.value = +this.operationOriginalData.amount;
        }
        if (this.dateInputElement.value !== this.operationOriginalData.date) {
            this.dateInputElement.value = this.operationOriginalData.date;
        }
        if (this.commentInputElement.value !== this.operationOriginalData.comment) {
            this.commentInputElement.value = this.operationOriginalData.comment;
        }

        await this.chosenOperation(this.operationOriginalData).then();
        return this.operationOriginalData;
    }

    async chosenOperation(data) {
        let operations;
        if (data.type === 'income' || data.type === 'expense') {
            let result =
                data.type === 'income'
                    ? await HttpUtils.request('/categories/income')
                    : await HttpUtils.request('/categories/expense');

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (!result.response) {
                return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
            }
            operations = result.response;
        }

        this.showOperation(data.category, operations);
        // return this.operationOriginalData1;
    }

    showOperation(category, operations) {

        for (let i = 0; i < operations.length; i++) {

            operations.category = operations[i].title;
            const categoryOptionElement = document.createElement('option');
            categoryOptionElement.value = operations[i].id;
            categoryOptionElement.innerText = operations[i].title;
            if (operations[i].title === category) {
                this.categorySelectElement.value = operations[i].id;
                categoryOptionElement.setAttribute('selected', 'selected');
            }
            this.categorySelectElement.appendChild(categoryOptionElement);
        }

        return operations;
    }

    validateForm() {
        let isValid = true;

        let textInputArray = [
            this.categoryTypeElement,
            this.categorySelectElement,
            this.amountInputElement,
            this.dateInputElement,
            this.commentInputElement,
        ];

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

    async updateOperation() {

        if (this.validateForm()) {
            let changedData = {
                type: null,
                amount: null,
                date: null,
                comment: null,
                category_id: null,
            };
            if (Object.keys(changedData).length > 0) {

                if (this.categoryTypeElement.value !== this.operationOriginalData.type) {
                    changedData.type = this.categoryTypeElement.value;
                } else {
                    changedData.type = this.operationOriginalData.type;
                }

                if (this.categorySelectElement.value !== this.operationOriginalData.category) {
                    if (this.categorySelectElement.value !== this.operationOriginalData.id) {

                        changedData.category_id = parseInt(this.categorySelectElement.value);

                        console.log(parseInt(this.categorySelectElement.value));
                    }
                }

                if (this.amountInputElement.value !== this.operationOriginalData.amount) {
                    changedData.amount = +this.amountInputElement.value;
                } else {
                    changedData.amount = +this.operationOriginalData.amount;
                }
                if (this.dateInputElement.value !== this.operationOriginalData.date) {
                    changedData.date = this.dateInputElement.value.toLocaleString('ru-RU');
                } else {
                    changedData.date = this.operationOriginalData.date;
                }
                if (this.commentInputElement.value !== this.operationOriginalData.comment) {
                    changedData.comment = this.commentInputElement.value;
                } else {
                    changedData.comment = this.operationOriginalData.comment;
                }

                const idOperation =  UrlUtils.getUrlParam('id');

                let result = await HttpUtils.request('/operations/' + idOperation, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (!result.response) {
                    return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
                }
                return this.openNewRoute('/operations');
            }
        }
    }
}