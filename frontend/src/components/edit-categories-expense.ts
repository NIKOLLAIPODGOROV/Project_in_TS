import {HttpUtils} from "../utils/http-utils";
import {UrlUtils} from "../utils/url-utils";
import {RouteType} from "../types/route.type";
import {RequestType} from "../types/request.type";

export class EditCategoriesExpense {
    readonly titleCategoryInputElement: HTMLElement | null;
    readonly updateButtonElement: HTMLElement | null;
    public categoryOriginalData: any[] | null;
    public openNewRoute: RouteType[];

    constructor(openNewRoute: RouteType[]) {
        this.categoryOriginalData = [];
        this.openNewRoute = openNewRoute;

        this.titleCategoryInputElement = document.getElementById('titleCategoryInput');
        this.updateButtonElement = document.getElementById('updateButton');
        if (!this.updateButtonElement) {
            return;
        }
        this.updateButtonElement.addEventListener('click', this.updateCategory.bind(this));
        this.getCategory().then();
    }

   private async getCategory(): Promise<any> {
        const id: string = UrlUtils.getUrlParam('id');
        const result: RequestType = await HttpUtils.request('/categories/expense/' + id);
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

   public validateForm(): boolean {
        let isValid: boolean = true;
        if (!this.titleCategoryInputElement) {
            return
        }
        let textInputArray: HTMLElement[] | null = [this.titleCategoryInputElement];

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

    private async updateCategory(e): Promise<any> {
        e.preventDefault();
        const id: string = UrlUtils.getUrlParam('id');
        if (this.validateForm()) {
            let changedData: { title: any[] | null } = {title: null,};

            if (!changedData) {
                return
            }
            if (Object.keys(changedData).length > 0) {
                if (this.titleCategoryInputElement.value !== this.categoryOriginalData) {
                    changedData.title = this.titleCategoryInputElement.value;
                    changedData.id = this.categoryOriginalData.id;
                }

                let result: RequestType = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (!result.response) {
                    return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
                }
                return window.location.href = '/expense';
                // return this.openNewRoute('/expense');
            }
        }
    }
}