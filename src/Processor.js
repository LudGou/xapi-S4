export default class Processor {

    top10(statements) {
        return statements.sort((a, b) => {
            if (a.result.score.raw > b.result.score.raw) return -1;
            if (b.result.score.raw > a.result.score.raw) return 1;
            return 0;
        }).slice(0, 10)
    }

    successStats(statements) {
        let passed = statements.filter(s => s.result.success).length
        let failed = statements.length - passed
        return [failed, passed]
    }
}
