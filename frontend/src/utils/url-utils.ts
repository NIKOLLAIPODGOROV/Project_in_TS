export class UrlUtils {
   public static  getUrlParam(param: string) {
        const urlParams: URLSearchParams  = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
}