export class UrlUtils {
   public static  getUrlParam(param) {
        const urlParams: URLSearchParams  = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
}