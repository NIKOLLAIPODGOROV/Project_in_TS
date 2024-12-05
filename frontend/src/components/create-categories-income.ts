import {HttpUtils} from "../utils/http-utils";
import {RouteType} from "../types/route.type";
import {ResultResponseType} from "../types/result-response.type";
import {RequestType} from "../types/request.type";

export class CreateCategoriesIncome {
readonly titleCategoryInputElement: HTMLElement | null;
readonly  cardTitleInputElement: HTMLElement | null;
public openNewRoute: RouteType[];
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));
        this.titleCategoryInputElement = document.getElementById('titleCategoryInput');
        this.cardTitleInputElement = document.getElementsByClassName('card-title');
    }

    validateForm() {
        let isValid: boolean = true;

        let textInputArray = [this.titleCategoryInputElement];

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

    async saveCategory(e): Promise<any> {
        e.preventDefault();

        if (this.validateForm()) {
            const createData: string = {
                title: this.titleCategoryInputElement.value,
            };

            const result  = await HttpUtils.request('/categories/income', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (!result.response) {
                return alert('Возникла ошибка при добавлении категории. Обратитесь в поддержку');
            }
            return this.openNewRoute('/income');
        }
    }
}


