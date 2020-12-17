import axios from 'axios'

export default class StateApi {

    constructor(endpoint, token) {
        this.endpoint = endpoint
        this.token = token
    }

    post(activityId, agent, registration, stateId, document) {
        let filters = { activityId, agent, stateId }
        if (registration) filters.registration = registration
        return axios.post(this.endpoint + 'activities/state', document, {
                params: filters,
                headers: {
                    'X-Experience-API-Version': '1.0.0',
                    'Authorization': 'Basic ' + this.token,
                    'Content-Type': 'application/json'
                }
            }
        )
    }

    get(activityId, agent, registration, stateId) {
        let filters = { activityId, agent }
        if (registration) filters.registration = registration
        if (stateId) filters.stateId = stateId
        return axios.get(this.endpoint + 'activities/state', {
            params: filters,
            headers: {
                'X-Experience-API-Version': '1.0.0',
                'Authorization': 'Basic ' + this.token,
            }
        })
    }
}
