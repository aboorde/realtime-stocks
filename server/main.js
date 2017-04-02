import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
//import { Future } from 'fibers/future';
const Future = Npm.require('fibers/future')

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({

    getStockData: function(stock) {
      
      var seriesCounter = 0;
      var now = new Date();
      var nowYear = now.getFullYear();
      var nowMonth = now.getMonth() + 1;
      var nowDay = now.getDate();

      // Set up a future
      var future = new Future();
      var url = 'https://www.quandl.com/api/v3/datasets/YAHOO/' + stock + '.json?start_date=' + (nowYear - 1) + '-' + nowMonth + '-' + nowDay + 
              '&end_date=' + nowYear + '-' + nowMonth + '-' + nowDay + '&order=asc&api_key=' + process.env.STOCK_API;
      console.log(url);
      HTTP.call('GET', url, function(err, res) {
        if(err) { 
          future.throw(err); 
        } else {
          future.return(res)
        }

      });
      return future.wait();
    },

    checkStock: function(stock) {
      
      var checkFuture = new Future();
      var checkUrl = 'https://www.quandl.com/api/v3/datasets/YAHOO/' + stock + '.json?api_key=' + process.env.STOCK_API;
      HTTP.call('GET', checkUrl, function(error, result) {
        if(error) { 
          checkFuture.throw(error); 
        } else {
          checkFuture.return(result)
        }

      });
      return checkFuture.wait();
    }
});
