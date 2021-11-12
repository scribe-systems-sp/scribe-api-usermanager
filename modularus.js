"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modularus_1 = require("@scribe-systems/modularus");
const axios_1 = __importDefault(require("axios"));
const api_1 = require("./api");
const configuration_1 = require("./configuration");
class ModularusUsermanagerApi extends modularus_1.SApi {
    constructor() {
        super(...arguments);
        this.loaded = false;
        this.loadedInterceptors = [];
    }
    getApiIdentifier() {
        return "UsermanagerAPI";
    }
    isLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.loaded;
        });
    }
    loadApi(baseURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = new configuration_1.Configuration({ basePath: baseURL });
            this.apiClient = {
                usedAxios: axios_1.default,
                apiKeys: new api_1.APIKeysApi(configuration, baseURL, axios_1.default),
                accessRights: new api_1.AccessRightsApi(configuration, baseURL, axios_1.default),
                auth: new api_1.AuthApi(configuration, baseURL, axios_1.default),
                users: new api_1.UsersApi(configuration, baseURL, axios_1.default)
            };
            this.loaded = true;
        });
    }
    api() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < this.loadedInterceptors.length; index++) {
                const element = this.loadedInterceptors[index];
                (_a = this.apiClient) === null || _a === void 0 ? void 0 : _a.usedAxios.interceptors.request.eject(element);
            }
            for (let index = 0; index < window.Modularus.requestInterceptors.length; index++) {
                const element = window.Modularus.requestInterceptors[index];
                let nr = (_b = this.apiClient) === null || _b === void 0 ? void 0 : _b.usedAxios.interceptors.request.use(element);
                this.loadedInterceptors.push(nr);
            }
            return this.apiClient;
        });
    }
}
exports.default = ModularusUsermanagerApi;
