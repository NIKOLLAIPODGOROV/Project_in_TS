import { RouteType } from "./route.type"

export type RequestType = {
    respone?: any
    url: string,
    method?: string,
    useAuth?: boolean,
    body?: any,
    createData?: any[],
    changedData?: any[],
    response?: any[],
    redirect?: RouteType[]
}