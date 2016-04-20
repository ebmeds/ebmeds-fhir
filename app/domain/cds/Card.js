var Card = {
    
    create: function(item) {


        var card = {
            "name": "card",
            "part": [
                {
                    "name": "summary",
                    "valueString": item.summary
                },
                {
                    "name": "detail",
                    "valueString": item.detail
                },
                {
                    "name": "source",
                    "part": [
                        {
                            "name": "label",
                            "valueString": item.sourceLabel
                        },
                        {
                            "name": "url",
                            "valueUri": item.sourceUrl
                        }
                    ]
                },
                {
                    "name": "indicator",
                    "valueCode": item.indicator
                }
            ]
        };

        item.links.forEach(function(link) {

            card.part.push({
                "name": "link",
                "part": [
                    {
                        "name": "label",
                        "valueString": link.label
                    },
                    {
                        "name": "url",
                        "valueUri": link.url
                    }
                ]
            });
        });

        return card;
    }
};

module.exports = Card;