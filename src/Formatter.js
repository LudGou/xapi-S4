export default class Formatter {

    statements(statements) {
        return statements.slice(0, 15).map(statement => {
            if(statement.verb.id.split('/').pop() != "create"){
                let verb = statement.verb.id.split('/').pop()
                let color = verb == 'passed' ? 'text-success' : 'text-danger'

                return `
                    <div class="mb-3">
                        ${statement.actor.account.name}
                        <strong class="${color}">${verb}</strong>
                        with <strong>${statement.result.score.raw}/100</strong>
                    </div>
                `
            }else{return''}   

        }).join('') + '<div>...</div>'
    }

    statementsTop(statements) {
        let cpt=0
        return statements.slice(0, statements.length+10).map(statement => {
            cpt+=1
            let verb = statement.verb.id.split('/').pop()
            let color = verb == 'passed' ? 'text-success' : 'text-danger'

            return `
                <div class="mb-3">
                    ${cpt} :
                    ${statement.actor.account.name}
                    <strong>${verb}</strong>
                    with <strong class="${color}">${statement.result.score.raw}/100</strong>
                </div>
            `

        }).join('') 
    }

    quizz(statements){
        let quizzs=[]
        let retour=''
        statements.data.statements.map(statement => {
            quizzs.push(statement.object.id.split('/').pop());  
        })
        quizzs.sort()
        quizzs.forEach(id=>retour+='<option value="'+id+'">'+id+'</option>')
        return retour
    }

    apprenants(statements){
        return statements.slice(0, 30).map(statement => {
            return `
                <option selected value="${statement.actor.account.name}">${statement.actor.account.name}</option>
            `

        }).join('') + '<div>...</div>'

    }

    garde(val){
        var ctx = document.getElementById('stats2').getContext('2d');
        var cfg={
            originData:repartitionChart.originData,
            type: 'polarArea',
            data: {}
        }
        if (val=="Réussite"){ 
            cfg.data= {
                labels: ['De 40 à 59', 'De 60 à 79', 'Plus de 79', ],
                datasets: [{
                    data: [repartitionChart.originData[2],repartitionChart.originData[3],repartitionChart.originData[4]],
                    backgroundColor: ['rgba(200, 150, 20, 1)','rgba(100, 200, 132, 1)','rgba(40, 167, 69, 1)']
                }]
            }
            repartitionChart.destroy();
            repartitionChart=new Chart(ctx,cfg)
            repartitionChart.originData=cfg.originData
            repartitionChart.update()
            $('#raz').remove()
            $('<div id="raz" style="position: absolute;top: 190px;left: 110px;"><button class="btn btn-xs btn-warning" onclick="formatter.garde(\'\')">RAZ</button></div>').insertAfter('#stats');

        }else if(val=="Echec"){                 
            cfg.data= {
                labels: ['Moins de 20', 'De 20 à 39', 'De 40 à 59'],
                datasets: [{
                    data: [repartitionChart.originData[0],repartitionChart.originData[1],repartitionChart.originData[2]],
                    backgroundColor: ['rgba(220, 53, 69, 1)','rgba(225, 100, 70, 1)','rgba(200, 150, 20, 1)']
                }]
            }
            
            repartitionChart.destroy();
            repartitionChart=new Chart(ctx,cfg)
            repartitionChart.originData=cfg.originData
            repartitionChart.update()
            $('#raz').remove()
            $('<div id="raz" style="position: absolute;top: 190px;left: 110px;"><button class="btn btn-xs btn-warning" onclick="formatter.garde(\'\')">RAZ</button></div>').insertAfter('#stats');
        }else{ 
            repartitionChart.data.labels.length=0            
            repartitionChart.data.datasets[0].data.length=0;
            repartitionChart.data.labels=['Moins de 20', 'De 20 à 39', 'De 40 à 59', 'De 60 à 79', 'Plus de 80']
            repartitionChart.data.datasets[0].data=[repartitionChart.originData[0],repartitionChart.originData[1],repartitionChart.originData[2],repartitionChart.originData[3],repartitionChart.originData[4]];
            repartitionChart.data.datasets[0].backgroundColor=['rgba(220, 53, 69, 1)','rgba(225, 100, 70, 1)','rgba(200, 150, 20, 1)','rgba(100, 200, 132, 1)','rgba(40, 167, 69, 1)'];
            
            repartitionChart.update()
            $('#raz').remove()
        }
    }
}
