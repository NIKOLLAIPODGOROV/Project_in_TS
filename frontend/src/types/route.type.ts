export type RouteType = {
        route: string
        title: string
        filePathTemplate: string
        useLayout: string | boolean
        styles: string | null
        scripts: string | null
        load(): void
        unload(): void

}
