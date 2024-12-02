import {Router} from "./router";

class App {
    private router: Router;

    constructor() {
        this.router = new Router();
    }
}

(new App());

