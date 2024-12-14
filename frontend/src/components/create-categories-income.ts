import {HttpUtils} from "../utils/http-utils";
import {ResultResponseType} from "../types/result-response.type";

export class CreateCategoriesIncome {
    readonly titleCategoryInputElement: HTMLInputElement | null;
    public openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>){
        this.titleCategoryInputElement = document.getElementById('titleCategoryInput') as HTMLInputElement;
        this.openNewRoute = openNewRoute;
        const saveButtonElement: HTMLElement | null = document.getElementById('saveButton');

        if (!saveButtonElement) {
            return
        }
        saveButtonElement.addEventListener('click', this.saveCategory.bind(this));
    }

   private validateForm(): boolean | undefined {
        let isValid: boolean = true;

        if (!this.titleCategoryInputElement) {
            return
        }
        let textInputArray: HTMLInputElement[] | null  = [this.titleCategoryInputElement];
       if (!textInputArray) {
              return
        }

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

   private async saveCategory(e:any): Promise<any> {
        e.preventDefault();

        if (this.validateForm()) {
            if (!this.titleCategoryInputElement) {
                return
            }
            const createData: { title: string } = {
                
                title: this.titleCategoryInputElement.value,
            };

            const result: ResultResponseType | null = await HttpUtils.request('/categories/income', 'POST', true, createData);
            if (!result) {
                return
            }
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


