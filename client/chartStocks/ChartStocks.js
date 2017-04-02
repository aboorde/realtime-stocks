var Highcharts = require('highcharts/highstock');

function clientGetStocks() {
    Meteor.call('getStocks', function(err, res) {
        var stockList = [];
        var seriesOptions = [];
        console.log(res.length)
        res.forEach(function(obj) {
            stockList.push(obj.stockSymbol);
        });
        console.log(stockList);
        if(stockList.length === res.length) {
            stockList.forEach(function(stock, i) {
                Meteor.call('getStockData', stock, function(error, result) {
                    if(error) {throw error;}
                    console.log(result); 

                    var formattedStockData = result.data.dataset.data.map(function(d) {
                        return [ new Date(d[0]).getTime(), d[4] ]
                    });

                    seriesOptions[i] = {
                        name: result.data.dataset.dataset_code,
                        data: formattedStockData
                    };
                    if(seriesOptions.length === res.length) {
                        createChart(seriesOptions);
                    }
                });
            });
        }
    });
}

function createChart(seriesOptions) {
    $('[data-highcharts-chart]').remove();
    var container = document.createElement('div');
    document.body.appendChild(container);
    var myChart = Highcharts.stockChart({
        chart: {
            renderTo: container,
            height: 400
        },
        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });
}

Template.ChartStocks.onCreated(function() {  
    var self = this;
    self.autorun(function() {
        self.subscribe('stocks', function() {
            Tracker.autorun(function() {
                clientGetStocks();
            });
        });
    });
    
});

Template.ChartStocks.helpers({
    stocks: ()=> {
        return Stocks.find({});
    }
});

Template.ChartStocks.events({
    'submit .new-stock-group': function(event, template) {
        event.preventDefault();
        console.log("BOOPBOOP")
        var newStock = '';
        if(event.target[0].value !== '') {
            newStock = event.target[0].value;
            $('#new-stock').val("")
            /*
            Meteor.call('stockAlreadyExists', newStock, function(err, res) {
                if(err) { throw err; }
            })
            */
            if(!Stocks.findOne({stockSymbol: newStock})) {
                Meteor.call('checkStock', newStock, function(err, res) {
                    if(err) { 
                        console.log('Stock Symbol Entered Does Not Exist')
                    }
                    if(res) {
                        console.log(res);
                        var newSymbol = res.data.dataset.dataset_code;
                        var newDescription = res.data.dataset.name;
                        newDescription = newDescription.substr(0, newDescription.length-2);

                        Meteor.call('addStock', newSymbol, newDescription, function(err, res) {
                            if(err) { 
                               throw err; 
                            }
                            if(res) {
                                console.log('res');
                                //clientGetStocks();
                            }
                            
                        });
                    }
                    
                });
                //console.log("It doesnt exist in the db")

            }
            //console.log(Stocks.findOne({stockSymbol: newStock}));
        }
        //console.log(event.target[0].value === '')
    },

    'click .fa-trash': function() {
        Meteor.call('removeStock', this.stockSymbol);
        //console.log(this)
    }
})