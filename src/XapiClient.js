import StatementApi from './StatementApi'
import StateApi from './StateApi'
import ExtendedApi from './ExtendedApi'

export default class XapiClient {

    config(endpoint, token) {
        this.statement = new StatementApi(endpoint, token)
        this.state = new StateApi(endpoint, token)
    }

    extend(endpoint, token) {
        this.extended = new ExtendedApi(endpoint, token)
    }
}
