import {HttpUtils} from "../utils/http-utils";
import {RouteType} from "../types/route.type";
import {RequestType} from "../types/request.type";

export class CreateCategoriesIncome {
    readonly titleCategoryInputElement: HTMLElement | null;
    public openNewRoute: RouteType[];

    constructor(openNewRoute: RouteType[]) {
        this.titleCategoryInputElement = document.getElementById('titleCategoryInput');
        this.openNewRoute = openNewRoute;
        const saveButtonElement: HTMLElement | null = document.getElementById('saveButton');

        if (!saveButtonElement) {
            return
        }
        saveButtonElement.addEventListener('click', this.saveCategory.bind(this));
    }

   private validateForm(): boolean {
        let isValid: boolean = true;

        if (!this.titleCategoryInputElement) {
            return
        }
        let textInputArray: HTMLElement[] | null[] = [this.titleCategoryInputElement];

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
            const createData: { title: any[] } = {
                title: this.titleCategoryInputElement.value,
            };

            const result: RequestType[] = await HttpUtils.request('/categories/income', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (!result.response) {
                return alert('Возникла ошибка при добавлении категории. Обратитесь в поддержку');
            }
            return window.location.href = '/income';
            //  return this.openNewRoute('/income');
        }
    }
}


