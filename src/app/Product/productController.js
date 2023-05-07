const productProvider = require("../Product/productProvider");
const productService = require("../Product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const { callChatGPT } = require('../Product/chatGPT');


// 전제품 정보 조회
exports.allProducts = async function (req, res){

    const { order } = req.query;

    if(order =="like"){

        console.log("a");

    }
    else if(order == "hits"){

        const productListResult = await productProvider.retrieveProductListHits();
        return res.send(response(baseResponse.SUCCESS, productListResult));

    }
    else if(order == "highprice"){

        const productListResult = await productProvider.retrieveProductListHighprice();
        return res.send(response(baseResponse.SUCCESS, productListResult));

    }
    else if(order == "lowprice"){

        const productListResult = await productProvider.retrieveProductListLowprice();
        return res.send(response(baseResponse.SUCCESS, productListResult));

    }
    else if(order == "abc"){

        const productListResult = await productProvider.retrieveProductListABC();
        return res.send(response(baseResponse.SUCCESS, productListResult));

    }
    else if(order == "zxy"){

        const productListResult = await productProvider.retrieveProductListZXY();
        return res.send(response(baseResponse.SUCCESS, productListResult));
        
    }
    else {      // default

        const productListResult = await productProvider.retrieveProductList();
        return res.send(response(baseResponse.SUCCESS, productListResult));
        
    }

}

// 특정 제품 정보 조회
exports.getProduct = async function (req, res){

    const productId = req.params.productId;
    const productResult = await productProvider.retrieveProduct(productId);     
    const productRecResult = await productProvider.retrieveRecProduct(productId);
    const productTopRecResult = await productProvider.retrieveTopRecProduct(productId);
    const productBaseRecResult = await productProvider.retrieveBaseRecProduct(productId);

    // 조회수 증가
    const hits = await productService.updateHits(productId);                     

    return res.send(response(baseResponse.SUCCESS, {productInfo: productResult, recInfo: productRecResult, topRecInfo: productTopRecResult, baseRecInfo: productBaseRecResult}));
}

// 설문 결과 조회
exports.getQuestionResult = async function (req, res){

    const result = req.params.result;
    const questionResult = await productProvider.retrieveQuestionResult(result);

    return res.send(response(baseResponse.SUCCESS, questionResult));
}

// 검색 결과 조회
exports.searchItem = async function (req, res){

    const keyword = decodeURIComponent(req.params.keyword);             // 한글 파라미터를 위해 디코딩
    const searchResult = await productProvider.retrieveSearchResult(keyword);

    return res.send(response(baseResponse.SUCCESS, searchResult));

}



exports.askQuestion = async function (req, res){
//    const prompt = req.body;
    const prompt = "향수 브랜드 조말론에 대해서 알려줘";             // 변수명 변경 가능
    if(!req.body)
        return res.send('no');
    if(!prompt)
        return res.send('no');
    const response = await callChatGPT(prompt);
    const answer = await callChatGPT(response + "\n이 내용 100자 이내로 요약해줘");

    if(answer){
        console.log(answer);
        return res.send({'answer' : answer});
    } else {
        console.log('err');
        res.status(500).json({'error':'Fail'});
        // res.send(baseResponse.SERVER_ERROR);
    }
}