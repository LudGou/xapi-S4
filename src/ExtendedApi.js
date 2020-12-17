import axios from 'axios'

export default class ExtendedApi {

    constructor(endpoint, token) {
        this.endpoint = endpoint
        this.token = token
    }

    get(params) {
        return axios.get(this.endpoint + 'statements', {
            params: params,
            headers: {
                'Authorization': 'Basic ' + this.token,
            }
        })
    }

    count(params) {
        return axios.get(this.endpoint + 'statements/count', {
            params: params,
            headers: {
                'Authorization': 'Basic ' + this.token,
            }
        })
    }
}
