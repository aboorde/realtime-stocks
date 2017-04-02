Stocks = new Mongo.Collection('stocks');
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';


StocksSchema = new SimpleSchema({
    stockSymbol: {
        type: String,
        label: "Symbol"
    },
    stockDescription: {
        type: String,
        label: "Description"
    }
});

Meteor.methods({
    addStock: function(stockSymbolInput, stockDescriptionInput) {

        //var url = 'https://www.quandl.com/api/v3/datasets/YAHOO/' + stock + '.json?api_key=F-uG2ad99rJDxfKAV8nm';
        Stocks.insert({'stockSymbol': stockSymbolInput, 'stockDescription': stockDescriptionInput});
        return true;
    },

    getStocks: function() {
        return Stocks.find().fetch();
    },
    removeStock: function(stock) {
        Stocks.remove({'stockSymbol': stock});
    }
});

Stocks.attachSchema(StocksSchema);