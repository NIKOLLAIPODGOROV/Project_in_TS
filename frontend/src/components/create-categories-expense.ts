import {HttpUtils} from "../utils/http-utils";
import {RouteType} from "../types/route.type";
import {RequestType} from "../types/request.type";

export class CreateCategoriesExpense {
 readonly titleCategoryInputElement: HTMLElement | null;
 public  cardTitleInputElement: HTMLElement | null;
 public openNewRoute: RouteType[];

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));
        this.titleCategoryInputElement = document.getElementById('titleCategoryInput');
        this.cardTitleInputElement = document.getElementsByClassName('card-title');
    }

   private validateForm() {
        let isValid: boolean = true;

        let textInputArray: (HTMLElement | null)[] = [this.titleCategoryInputElement];

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

   private async saveCategory(e): Promise<any> {
        e.preventDefault();

        if (this.validateForm()) {
            const createData: any = {
                title: this.titleCategoryInputElement.value,
            };

            const result: RequestType | any = await HttpUtils.request('/categories/expense', 'POST', true, createData);
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