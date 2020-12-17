# 04. Classement et statistiques #2


## Objectif

Dans l'exercice précédent, nous avons constaté que les performances
n'étaient pas toujours au rendez-vous lorsque nous utilisons les API standards
pour nos analyses de données.

Heureusement, certains LRS exposent des API étendues qui peuvent améliorer les choses.
Bien sûr, ces APIs sont non standardisées, donc on crée une dépendance au LRS.
Mais ça peut être un compromis acceptable dans certains cas.


## Utilisation

### Simple test

Si vous souhaitez tester ce projet, lancez la page **dist/index.html**.

### Modification

Si vous souhaitez modifier ce projet, depuis sa racine, faites d'abord...
```
npm install
```
...puis après avoir modifié le code, recompilez avec :
```
npm run build
```

### Création

La suite de ce document explique les étapes qui ont permis d'obtenir ce résultat.
Nous sommes reparti de l'exercice **03_ranking1**.


## Flux d'activité

Pour notre flux d'activité, nous n'avons besoin que des 15 derniers statements,
donc nous bridons le nombre de statements téléchargés à 15.

Dans **index.html** :

```
function refresh() {

    dataset.get(function(statements) {
        $('#activity').html(formatter.statements(statements))
    }, 15)

    ...
```

Dans la classe `Dataset`, nous ajoutons le paramètre `count` à la fonction `get` :

```
get(callback, count = 1000) {
    this.xapi.statement.get(count, this.activityId).then(response => {
        callback(response.data.statements)
    })
}
```


## API étendue

Pour le tableau de classement et les statistiques, nous allons utiliser l'API étendue de TRAX LRS.

Commençons par créer une classe `ExtendedApi` qui expose 2 fonctions : `get` et `count`.

```
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
```

Instancions notre API dans `XapiClient`. Attention, le **endpoint** va être différent
de celui des API standardisées, donc nous utilisons une fonction spécifique : `extend()`.

```
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
```

Ne reste plus qu'à configurer notre API étendue. Nous le ferons dans le `main.js`.

```
window.xapi.config('https://lrs.learnxapi.fr/trax/api/f108ce59-bc64-4a89-b13f-166a12c26ba1/xapi/std/', btoa('moodle:password'))
window.xapi.extend('https://lrs.learnxapi.fr/trax/api/f108ce59-bc64-4a89-b13f-166a12c26ba1/xapi/ext/', btoa('moodle:password'))
```


## Tableau de classement

Dans **index.html**, nous appelons une nouvelle fonction `top10` cette fois implémentée
par la classe `Dataset`, et nous affichons directement le résultat :

```
function refresh() {
    ... 

    dataset.top10(function(statements) {
        $('#ranking').html(formatter.statements(statements))
    })
}
```

Dans la classe `Dataset`, nous implémentons la fonction `top10`,
qui fait appel à l'API étendue.

Le filtrage utilise le formalisme de l'API étendue de TRAX LRS.
Les statements sont extraits de la réponse telle que fournie par TRAX LRS.

```
top10(callback) {
    this.xapi.extended.get({
        filters: { 'data->object->id': this.activityId },
        sort: ['-data->result->score->raw'],
        limit: 10
    })
    .then(response => {
        let statements = response.data.data.map(item => item.data)
        callback(statements)
    })
}
```


## Statistiques

La démarche est relativement similaire pour les statisques.

Dans **index.html**, nous appelons une nouvelle fonction `successStats` cette fois implémentée
par la classe `Dataset`, et nous affichons directement le résultat :

```
function refresh() {

    ...

    dataset.successStats(function(stats) {
        var ctx = document.getElementById('stats').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Echec', 'Réussite'],
                datasets: [{
                    data: stats,
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)',
                    ]
                }]
            }
        });
    })
}
```

Dans la classe `Dataset`, nous implémentons la fonction `successStats`,
qui fait appel à l'API étendue.

```
successStats(callback) {
    this.xapi.extended.count({
        filters: { 
            'data->object->id': this.activityId,
            'data->result->success': true,
        },
        options: {
            unfiltered: true
        }
    })
    .then(response => {
        callback([response.data.unfiltered - response.data.count, response.data.count])
    })
}
```


## Regard critique

D'un point de vue traffic réseau, nous avons considérablement amélioré les performances
en ne chargeant que les données dont nous avons réellement besoin.

De son coté, l'application LRS charge elle aussi moins de données en mémoire avant de les
retourner au client, donc on soulage un peu sa RAM.

En revanche, le LRS a transféré la charge sur la base de données qui doit exécuter
des requêtes plus nombreuses et plus complexes.



## Compilation et test

Depuis la racine de l'exercice :
```
npm run build
```

Ouvrez le fichier **dist/index.html**, générez des données ou rafraichissez et observez.
