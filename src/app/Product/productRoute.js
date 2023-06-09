module.exports = function(app){
    const product = require('./productController');

    app.get('/products', product.allProducts);

    app.get('/products/:productId', product.getProduct);

    app.get('/question/result/:result', product.getQuestionResult);

    app.get('/search/:keyword', product.searchItem);

    app.post('/chatGPT/qna', product.askQuestion);
    app.get('/chatGPT/qna', product.getAnswer);


};
