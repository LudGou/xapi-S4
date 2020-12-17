import axios from 'axios'

export default class StatementApi {

    constructor(endpoint, token) {
        this.endpoint = endpoint
        this.token = token
    }

    post(statement) {
        return axios.post(this.endpoint + 'statements', statement, {
                headers: {
                    'X-Experience-API-Version': '1.0.0',
                    'Authorization': 'Basic ' + this.token,
                    'Content-Type': 'application/json'
                }
            }
        )
    }

    postCreaQuizz(statement){
        return axios.post(this.endpoint + 'statements', statement, {
            headers: {
                'X-Experience-API-Version': '1.0.0',
                'Authorization': 'Basic ' + this.token,
                'Content-Type': 'application/json'
            }
        })
    }

    get(count, activityId) {
        let filters = {}
        if (count) filters.limit = count
        if (activityId) filters.activity = activityId
        return axios.get(this.endpoint + 'statements', {
            params: filters,
            headers: {
                'X-Experience-API-Version': '1.0.0',
                'Authorization': 'Basic ' + this.token,
            }
        })
    }

    getQuiz(count) {
        let filters = {}
        filters.verb="http://adlnet.gov/expapi/verbs/create"
        if (count) filters.limit = count
        return axios.get(this.endpoint + 'statements', {
            params: filters,
            headers: {
                'X-Experience-API-Version': '1.0.0',
                'Authorization': 'Basic ' + this.token,
            }
        })
    }
}
