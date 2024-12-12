export type RouteType = {
        url?: string,
        route: string
        title?: string
        filePathTemplate?: string
        useLayout?: string | boolean
        styles?: string[]
        scripts?: string[]
        load(): void
        unload?(): void
}
