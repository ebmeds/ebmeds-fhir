var Card = require('../../cds/Card');

var FinriskLink = {
    
    toCard: function(finriskDataset) {
        return Card.create({
            summary: "FINRISK calculator",
            detail: "With the FINRISK calculator you can calculate your risk of acute myocardial infarction or acute disorder of the cerebral circulation within the next ten years. The calculator gives your disease risk as a percentage.",
            sourceLabel: "FINRISK calculator - Instructions and interpretation",
            sourceUrl: "https://www.thl.fi/en/web/chronic-diseases/cardiovascular-diseases/finrisk-calculator/instructions",
            indicator: "info",
            links: [{ label: "FINRISK calculator", url: finriskDataset.DataSetText[0] }]
        });
    }
};

module.exports = FinriskLink;