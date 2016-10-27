var Card = require('../../cds/Card');

var CmrLink = {
    
    toCard: function(cmrDataset) {
        return Card.create({
            summary: "Comprehensive Medication Review",
            detail: "CMR detail",
            sourceLabel: "CMR label",
            sourceUrl: "CMR url",
            indicator: "info",
            links: [{ label: "Comprehensive Medication Review", url: cmrDataset.DataSetText[0] }]
        });
    }
};

module.exports = CmrLink;