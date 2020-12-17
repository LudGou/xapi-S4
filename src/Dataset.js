export default class Dataset {

    constructor(xapi) {
        this.xapi = xapi
    }

    top10(callback) {
        let limiteA=$('#ranking div.mb-3').length+10
        this.xapi.extended.get({
            filters: { 'data->object->id': this.activityId },
            sort: ['-data->result->score->raw'],
            limit: limiteA
        })
        .then(response => {
            let statements = response.data.data.map(item => item.data)
            callback(statements)
        })
    }
    
    successStats(callback) {
        this.xapi.extended.count({
            filters: { 
                'data->object->id': this.activityId,
                'data->result->success': true,
            }
        })
        .then(reponseEchec => {
            this.xapi.extended.count({
                filters: { 
                    'data->object->id': this.activityId,
                    'data->result->success': false,
                },
            })
            .then(reponseReussi => {
                callback([reponseReussi.data.count, reponseEchec.data.count])
            })
        })
    }

    repartition(callback){
        let tab=[0,0,0,0,0]
        this.xapi.extended.count({
            filters: { 
                'data->object->id': this.activityId,
                $and: [ {'data->result->score->raw': { "$gte": 80}}, {'data->result->score->raw': { "$lt": 100} }],
            }
        })
        .then(response80=>{
            this.xapi.extended.count({
                filters: { 
                    'data->object->id': this.activityId,
                    $and: [ {'data->result->score->raw': { "$gte": 60}}, {'data->result->score->raw': { "$lt": 80} }],
                }
            })
            .then(response60=>{
                tab[3]=response60.data.count
                this.xapi.extended.count({
                    filters: { 
                        'data->object->id': this.activityId,
                        $and: [ {'data->result->score->raw': { "$gte": 40}}, {'data->result->score->raw': { "$lt": 60} }],
                    }
                })
                .then(response40=>{ 
                    tab[2]=response40.data.count
                    this.xapi.extended.count({
                        filters: { 
                            'data->object->id': this.activityId,
                            $and: [ {'data->result->score->raw': { "$gte": 20}}, {'data->result->score->raw': { "$lt": 40} }],
                        }
                    })
                    .then(response20=>{
                        tab[1]=response20.data.count
                        this.xapi.extended.count({
                            filters: { 
                                'data->object->id': this.activityId,
                                'data->result->score->raw': { "$lt":20}
                            }
                        })
                        .then(response => {
                            callback([response.data.count,response20.data.count,response40.data.count,response60.data.count,response80.data.count])
                        })
                    })
                })
            })
        })        
    }
    succesParQuestion(callback){
        callback( [[13,12,4,20,2,],[37,38,46,30,48]])
    }

    succesParQuestionLines(callback){
        callback( [[13,12,4,20,2,],[37,38,46,30,48]])
    }

    get(callback, count = 1000) {
        this.xapi.statement.get(count, this.activityId).then(response => {
            callback(response.data.statements)
        })
    }

    getTracesDeCreaQuizz(callback, count = 1000) {
        this.xapi.statement.getQuiz(count).then(response => {
            callback(response)
        })
    }


    post(callback) {
        let statements = []
        for (let i = 0; i < 40; i++) {
            statements.push(this.statement())
        }
        this.xapi.statement.post(statements).then(response => {
            callback()
        })
    }

    statement() {
        let result = this.result();
        let verbId = 'http://adlnet.gov/expapi/verbs/' + (result.success ? 'passed' : 'failed')
        return {
            actor: this.actor(),
            verb: { id: verbId },
            object: { id: this.activityId },
            result: result
        }
    }
    /**
     * requete pour envoie d'une state de création de quizzz
     * à n'utiliser qu'une fois
    */
    postCreationQuizz(){
        let statements = []
        for (let i = 0; i < 2; i++) {
            statements.push(this.statementCreaQuizz(i))
        }
        this.xapi.statement.postCreaQuizz(statements)
    }

    statementCreaQuizz(i) {
        let tab=['http://learnxapi.fr/activities/quiz/785785785','http://learnxapi.fr/activities/quiz/785785786']
        ///let result = Ludovic created Quiz;
        let verbId = 'http://adlnet.gov/expapi/verbs/create'
        return {
            actor: {account: {name: 'gousseau',homePage: 'https://learnxapi.fr'}},
            verb: { id: verbId },
            object: { id: tab[i] },
            //result: result  
        }
    }

    actor() {
        return {
            account: {
                name: Math.random().toString(36).substring(8),
                homePage: 'https://learnxapi.fr'
            },
        }
    }
    
    result() {
        let rawScore = Math.round(Math.random() * 100)
        let success = rawScore >= 50
        return {
            success: success,
            score: {
                scaled: rawScore / 100,
                raw: rawScore,
                min: 0,
                max: 100
            },
        }
    }
}
