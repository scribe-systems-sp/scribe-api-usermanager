import { SApi, Modularus } from '@scribe-systems/modularus'
import Axios, { AxiosStatic } from 'axios'

import { APIKeysApi, AccessRightsApi, AuthApi, UsersApi } from './api'
import { Configuration } from './configuration'

declare global {
    interface Window { Modularus: Modularus; }
}

export interface UsermanagerAPI {
    usedAxios: AxiosStatic,
    apiKeys: APIKeysApi,
    accessRights: AccessRightsApi,
    auth: AuthApi,
    users: UsersApi
}

export default class ModularusUsermanagerApi extends SApi {
    loaded = false
    apiClient: UsermanagerAPI
    loadedInterceptors: any[] = []

    getApiIdentifier(): String {
        return "UsermanagerAPI"
    }
    async isLoaded(): Promise<boolean> {
        return this.loaded
    }
    async loadApi(baseURL: string): Promise<void> {
        const configuration = new Configuration({ basePath: baseURL })

        this.apiClient = {
            usedAxios: Axios,
            apiKeys: new APIKeysApi(configuration, baseURL, Axios),
            accessRights: new AccessRightsApi(configuration, baseURL, Axios),
            auth: new AuthApi(configuration, baseURL, Axios),
            users: new UsersApi(configuration, baseURL, Axios)
        } as UsermanagerAPI

        this.loaded = true
    }

    async api(): Promise<any> {
        for (let index = 0; index < this.loadedInterceptors.length; index++) {
            const element = this.loadedInterceptors[index];
            this.apiClient?.usedAxios.interceptors.request.eject(element)
        }
        
        for (let index = 0; index < window.Modularus.requestInterceptors.length; index++) {
            const element = window.Modularus.requestInterceptors[index];
            let nr = this.apiClient?.usedAxios.interceptors.request.use(element)
            this.loadedInterceptors.push(nr)
        }
        
        return this.apiClient
    }
}