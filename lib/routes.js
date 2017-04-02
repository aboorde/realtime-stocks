FlowRouter.route('/', {
    name: 'main',
    action() {
        BlazeLayout.render('MainLayout', {main: 'ChartStocks'});
    }
});