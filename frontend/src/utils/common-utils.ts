import config from "../config/config";

export class CommonUtils {

    static getTypeHtml(type) {
        let typeHtml = null;
        switch (type) {
            case config.host.categoryType.income:
                typeHtml = '<span class="badge badge-info">доход</span>';
                break;
            case config.host.categoryType.expense:
                typeHtml = '<span class="badge badge-warning">расход</span>';
                break;
            default:
                typeHtml = '<span class="badge badge-secondary">Unknown</span>';
        }

        return typeHtml;
    }
}