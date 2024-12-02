import {HttpUtils} from "../utils/http-utils";

export class CreateCategoriesIncomeExpenses {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveIncomeButton').addEventListener('click', this.saveOperation.bind(this));

        this.findElements();
        this.chosenOperation().then();
        this.showOperation();
    }

    findElements() {
        this.categoryTypeElement = document.getElementById('typeInput');
        this.categorySelectElement = document.getElementById('categoryInput');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');
    }

    async chosenOperation() {
        let that = this;
        const categoryTypeElement = document.getElementById('typeInput');
        categoryTypeElement.onchange = async function () {
            if ((categoryTypeElement.value === 'income' || categoryTypeElement.value === 'expense') && categoryTypeElement.value !== 'Тип...') {
                let result = categoryTypeElement.value === 'income' ? await HttpUtils.request('/categories/income') : await HttpUtils.request('/categories/expense');
                if (result.redirect) {
                    return that.openNewRoute(result.redirect);
                }
                if (!result.response) {
                    return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
                }
                that.operationOriginalData = result.response;
            }
            await that.showOperation(that.operationOriginalData);
            return that.operationOriginalData;
        }
        return this.operationOriginalData;
    }

        validateForm() {
            let isValid = true;
            let textInputArray = [this.categoryTypeElement, this.categorySelectElement,
                this.amountInputElement, this.dateInputElement,this.commentInputElement];

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

    showOperation() {

        const categorySelectElement = document.getElementById('categoryInput');
        categorySelectElement.innerHTML = '';
        const categoryOptionBaseElement = document.createElement('option');
        categoryOptionBaseElement.innerText = 'Категория...';
        categoryOptionBaseElement.style.color = 'text-secondary';
        categoryOptionBaseElement.setAttribute('selected', 'selected');
        categorySelectElement.appendChild(categoryOptionBaseElement);
        if (!this.operationOriginalData) {
            return;
        }
        for (let i = 0; i < this.operationOriginalData.length; i++) {
            this.operationOriginalData.id = this.operationOriginalData[i].id;
            this.operationOriginalData.type = this.categoryTypeElement.value;
            this.operationOriginalData.category = this.operationOriginalData[i].title;
            this.operationOriginalData.amount = this.amountInputElement.value;
            this.operationOriginalData.date = this.dateInputElement.value;
            this.operationOriginalData.comment = this.commentInputElement.value;

            const categoryOptionElement = document.createElement('option');
            categoryOptionElement.value = this.operationOriginalData[i].id;
            categoryOptionElement.innerText = this.operationOriginalData[i].title;

            categorySelectElement.appendChild(categoryOptionElement);
        }
    }

    async saveOperation(e) {
        e.preventDefault();
        let createData = {};
        if (this.validateForm()) {
            createData = {
                type: this.categoryTypeElement.value,
                category_id: parseInt(this.categorySelectElement.value),
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value.toLocaleString('ru-RU'),
                comment: this.commentInputElement.value
            };

            const result = await HttpUtils.request('/operations', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (!result.response) {
                return alert('Возникла ошибка при добавлении операции. Обратитесь в поддержку');
            }
            return this.openNewRoute('/operations');
        }
    }
}