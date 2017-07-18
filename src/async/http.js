import axios from 'axios'
import config from '../config/config'

// const asynquenceSrc = require('asynquence/asq.src.js')
// import asynquenceContrib from './contrib.src.js'
import ASQ from './contrib.src.js'

// const ASQ = asynquenceContrib(asynquenceSrc)

const httpService = () => {

    /* 
      Return a factory function to create new instances of the api. 
      This is important for eliminating the risk of mutated state 
      in the app.
    */
    return (() => {

        const token = localStorage.access_token ? localStorage.access_token : ''

        const defaultConfig = config.useOauth 
                            ?  {
                                    headers: {
                                        // withCredentials: true,
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                        'X-Requested-With': 'XMLHttpRequest',
                                        Authorization: `Bearer ${ token }`
                                    },
                                    params: {

                                    }
                                }
                            : {}

        let apiURI = ''
        let payLoad = {}

        /*
          Catch what is returned by the coreAPI and wrap axios responses
          in Asynquence for more robust async handling.
        */
        const API = {
            getConfig: () => defaultConfig,
            getAPIRoot: () => config.apiRoot,
            getAPIURI: () => apiURI,
            axios,
            ASQ,
            route: route => { 
                const cleanedRoute = route.split('/').filter(str => str.length > 0).join('/') // remove any extra slashes
                apiURI = config.apiRoot + '/' + cleanedRoute

                console.log('request route', apiURI)

                return shortAPI
            },
            uri: uri => { apiURI = uri; return API },
            config: config => {defaultConfig.params = config; return API},
            req: (payLoad, config = defaultConfig) => ASQ(done => axios.request(payLoad, config).then(done)),
            fetch: () => ASQ(done => core.get().then(done)),
            get: (url, config = defaultConfig) => ASQ(done => axios.get(url, config).then(done)),
            post: (url, data = {}, config = defaultConfig) => ASQ(done => axios.post(url, data, config).then(done)),
            put: (url, data = {}, config = defaultConfig) => ASQ(done => axios.put(url, data, config).then(done)),
            patch: (url, data = {}, config = defaultConfig) => ASQ(done => axios.patch(url, data, config).then(done)),
            delete: (url, config = defaultConfig) => ASQ(done => axios.delete(url, config).then(done)),
        }

        const shortAPI = {
            config: config => { defaultConfig.params = config; return shortAPI},
            payload: data => { payLoad = data; return shortAPI},
            get: (config = defaultConfig) => ASQ(done => axios.get(apiURI, config).then(done)),
            post: (config = defaultConfig) => ASQ(done => axios.post(apiURI, payLoad, config).then(done)),
            patch: (config = defaultConfig) => ASQ(done => axios.patch(apiURI, payLoad, config).then(done)),
            delete: (config = defaultConfig) => ASQ(done => axios.delete(apiURI, config).then(done)),
        }

        const core = {
            get: () => axios.get(apiURI, defaultConfig)
        }

        return API
    })
}

export default httpService
