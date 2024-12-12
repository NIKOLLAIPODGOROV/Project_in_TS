import {HttpUtils} from "../utils/http-utils";
import {UrlUtils} from "../utils/url-utils";
import {RouteType} from "../types/route.type";
import {RequestType} from "../types/request.type";
import {OperationOriginalDataType} from "../types/operation-original-data.type";

export class EditCategoriesIncomeExpenses {
    readonly categoryTypeElement: HTMLInputElement | null;
    readonly categorySelectElement: HTMLInputElement | null;
    readonly amountInputElement: HTMLInputElement | null;
    readonly dateInputElement: HTMLInputElement | null;
    readonly commentInputElement: HTMLInputElement | null;
    readonly updateOperationElement: HTMLElement | null;


    private operationOriginalData: OperationOriginalDataType | any;
    public openNewRoute: RouteType[];


    constructor(openNewRoute: RouteType[]) {
        this.operationOriginalData = null;
        this.openNewRoute = openNewRoute;

        this.categoryTypeElement = document.getElementById('typeInput') as HTMLInputElement;
        this.categorySelectElement = document.getElementById('categoryInput') as HTMLInputElement;
        this.amountInputElement = document.getElementById('amountInput') as HTMLInputElement;
        this.dateInputElement = document.getElementById('dateInput') as HTMLInputElement;
        this.commentInputElement = document.getElementById('commentInput') as HTMLInputElement;
        this.updateOperationElement = document.getElementById('updateOperation');
        if (!this.updateOperationElement) {
            return
        }

        this.updateOperationElement.addEventListener('click', this.updateOperation.bind(this));
        this.getOperation().then();
    }

    private async getOperation(): Promise<any> {
        const id: string | null = UrlUtils.getUrlParam('id');

        const result: RequestType = await HttpUtils.request('/operations/' + id);
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
        if (!this.operationOriginalData) {
            return
        }

        if (this.operationOriginalData.type === 'income') {
            const incomeElement: HTMLElement | null = document.getElementById('income');
            if (!incomeElement) {
                return
            }
            incomeElement.setAttribute('selected', 'selected');
            if (!this.categoryTypeElement) {
                return
            }
            this.categoryTypeElement.value = 'income';
        } else if (this.operationOriginalData.type === 'expense') {

            const expenseElement: HTMLElement | null = document.getElementById('expense');
            if (!expenseElement) {
                return
            }
            expenseElement.setAttribute('selected', 'selected');
            if (!this.categoryTypeElement) {
                return
            }
            this.categoryTypeElement.value = 'expense';
        }
        if (!this.amountInputElement || !this.dateInputElement || !this.commentInputElement) {
            return
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

    private async chosenOperation(data: any): Promise<any> {
        let operations: any;
        if (data.type === 'income' || data.type === 'expense') {
            let result: RequestType =
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
    }

    showOperation(category: string, operations: any) {

        for (let i: number = 0; i < operations.length; i++) {

            operations.category = operations[i].title;
            const categoryOptionElement = document.createElement('option');
            categoryOptionElement.value = operations[i].id;
            categoryOptionElement.innerText = operations[i].title;
            if (operations[i].title === category) {
                if (!this.categorySelectElement) {
                    return
                }
                this.categorySelectElement.value = operations[i].id;
                categoryOptionElement.setAttribute('selected', 'selected');
            }
            if (!this.categorySelectElement) {
                return
            }
            this.categorySelectElement.appendChild(categoryOptionElement);
        }

        return operations;
    }

    public validateForm(): boolean {
        let isValid: boolean = true;
        let textInputArray: any[] | null = [
            this.categoryTypeElement,
            this.categorySelectElement,
            this.amountInputElement,
            this.dateInputElement,
            this.commentInputElement,
        ];

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

    private async updateOperation(): Promise<any> {

        if (this.validateForm()) {
            let changedData: any = {
                type: null,
                amount: null,
                date: null,
                comment: null,
                category_id: null,
            };
            if (Object.keys(changedData).length > 0) {
                if (!this.categoryTypeElement || !this.categorySelectElement ||
                    !this.amountInputElement || !this.dateInputElement || !this.commentInputElement) {
                    return
                }
                if (!this.operationOriginalData) {
                    return
                }
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

                const idOperation: string | null = UrlUtils.getUrlParam('id');

                let result = await HttpUtils.request('/operations/' + idOperation, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (!result.response) {
                    return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
                }
                return window.location.href = '/operations';
                // return this.openNewRoute('/operations');
            }
        }
    }
}