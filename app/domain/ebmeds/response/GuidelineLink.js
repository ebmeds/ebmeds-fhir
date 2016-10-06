var Card = require('../../cds/Card');

var GuidelineLink = {
    
    toCard: function(links) {
        return Card.create({
            summary: "Hoitosuositukset",
            detail: null,
            sourceLabel: "Lisätietoja",
            sourceUrl: "http://www.terveyskirjasto.fi",
            indicator: "info",
            links: links.map(function(link) {
                return { label: link.GuidelineTitle[0], url: link.GuidelineURL[0] };
            })
        });
    }
};

module.exports = GuidelineLink;