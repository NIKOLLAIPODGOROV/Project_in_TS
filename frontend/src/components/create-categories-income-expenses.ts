import {HttpUtils} from "../utils/http-utils";
import {OperationOriginalDataType} from "../types/operation-original-data.type";
import {ResultResponseType} from "../types/result-response.type";

export class CreateCategoriesIncomeExpenses {
    readonly categoryTypeElement: HTMLInputElement | null;
    readonly categorySelectElement: HTMLInputElement | null;
    readonly amountInputElement: HTMLInputElement | null;
    readonly dateInputElement: HTMLInputElement | null;
    readonly commentInputElement: HTMLInputElement | null;
    readonly saveIncomeButtonElement: HTMLElement | null;
    public operationOriginalData: any;

    public openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.operationOriginalData = null;
        this.openNewRoute = openNewRoute;

        this.categoryTypeElement = document.getElementById('typeInput') as HTMLInputElement;
        this.categorySelectElement = document.getElementById('categoryInput') as HTMLInputElement;
        this.amountInputElement = document.getElementById('amountInput') as HTMLInputElement;
        this.dateInputElement = document.getElementById('dateInput') as HTMLInputElement;
        this.commentInputElement = document.getElementById('commentInput') as HTMLInputElement;
        this.saveIncomeButtonElement = document.getElementById('saveIncomeButton') as HTMLInputElement;
        if (!this.saveIncomeButtonElement) {
            return;
        }
        this.saveIncomeButtonElement.addEventListener('click', this.saveOperation.bind(this));
        this.chosenOperation().then();
        this.showOperation();
    }

    private async chosenOperation(): Promise<any> {
        let that: this = this;
        const categoryTypeElement: HTMLInputElement | null = document.getElementById('typeInput') as HTMLInputElement;

        if (!categoryTypeElement) {
            return
        }

        categoryTypeElement.onchange = async function (): Promise<any> {
            if ((categoryTypeElement.value === 'income' || categoryTypeElement.value === 'expense') || categoryTypeElement.value !== 'Тип...') {
                let result: ResultResponseType | null = categoryTypeElement.value === 'income' ? await HttpUtils.request('/categories/income') : await HttpUtils.request('/categories/expense');
                if (!result) {
                    return
                }
                if (result.redirect) {
                    return that.openNewRoute(result.redirect);
                }
                if (!result.response) {
                    return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
                }
                that.operationOriginalData = result.response;
            }
            that.showOperation();
            return that.operationOriginalData;
        }
        return this.operationOriginalData;
    }

    public validateForm(): boolean | undefined {
        let isValid: boolean = true;
        if (!this.categoryTypeElement || !this.categorySelectElement || !this.amountInputElement ||
            !this.dateInputElement || !this.commentInputElement) {
            return;
        }
        let textInputArray: HTMLInputElement[] | null = [this.categoryTypeElement, this.categorySelectElement,
            this.amountInputElement, this.dateInputElement, this.commentInputElement];

        for (let i: number = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid;
    }

    private showOperation(): void {

        const categorySelectElement: HTMLInputElement | null = document.getElementById('categoryInput') as HTMLInputElement;
        if (!categorySelectElement) {
            return
        }
        categorySelectElement.innerHTML = '';
        const categoryOptionBaseElement: HTMLOptionElement = document.createElement('option');
        categoryOptionBaseElement.innerText = 'Категория...';
        categoryOptionBaseElement.style.color = 'text-secondary';
        categoryOptionBaseElement.setAttribute('selected', 'selected');
        categorySelectElement.appendChild(categoryOptionBaseElement);
        if (!this.operationOriginalData || typeof this.operationOriginalData !== 'object') {
            return
        }
        for (let i: number = 0; i < this.operationOriginalData.length; i++) {
            if (!this.operationOriginalData[i].id || !this.categoryTypeElement 
                ||!this.operationOriginalData[i].title || !this.amountInputElement || !this.dateInputElement || !this.commentInputElement) {
                    return
                }
            this.operationOriginalData.id = this.operationOriginalData[i].id;
            this.operationOriginalData.type = this.categoryTypeElement.value;
            this.operationOriginalData.category = this.operationOriginalData[i].title;
            this.operationOriginalData.amount = this.amountInputElement.value;
            this.operationOriginalData.date = this.dateInputElement.value;
            this.operationOriginalData.comment = this.commentInputElement.value;

            const categoryOptionElement: HTMLOptionElement | null = document.createElement('option');
            if (!categoryOptionElement || !this.operationOriginalData) {
                return
            }
            categoryOptionElement.value = this.operationOriginalData[i].id;
            categoryOptionElement.innerText = this.operationOriginalData[i].title;

            categorySelectElement.appendChild(categoryOptionElement);
        }
    }

    private async saveOperation(e:any): Promise<any> {
        e.preventDefault();
        let createData: any = {};
        if (!this.categoryTypeElement || !this.categorySelectElement
            || !this.amountInputElement || !this.dateInputElement || !this.commentInputElement) {
            return
        }
        if (this.validateForm()) {
            createData = {
                type: this.categoryTypeElement.value,
                category_id: parseInt(this.categorySelectElement.value),
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value.toLocaleString(),
                comment: this.commentInputElement.value
            };

            const result: ResultResponseType = await HttpUtils.request('/operations', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (!result.response) {
                return alert('Возникла ошибка при добавлении операции. Обратитесь в поддержку');
            }
            return window.location.href = '/operations';
            // return this.openNewRoute('/operations');
        }
    }
}