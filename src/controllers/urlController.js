const urlModel = require("../models/urlModel")
const shortId = require("shortid");
const validUrl = require('valid-url');
const redis = require('redis')
const { promisify } = require('util');

const redisClient = redis.createClient(             //syntax
    18561, //redis port
    "redis-18561.c212.ap-south-1-1.ec2.cloud.redislabs.com",  //redis db url

    { no_ready_check: true }
);
redisClient.auth("iFA13JDh4THujExqFlm0CHSnJpSLHsP9", function (err) {   // in callback function catch the error  redis password
    if (err) throw err;
});

redisClient.on("connect", async function () {  //build connection with redis db
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



const shortUrl = async function (req, res) {
    try {
        let longUrl = req.body.longUrl
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "please provide require data" })


        if (!longUrl) {
            return res.status(400).send({ status: false, message: "longUrl is must be present" });
        }
        if (!validUrl.isWebUri(longUrl)) {
            return res.status(400).send({ status: false, message: "please enter valid URL" })
        }
        
        let cachedUrl = await GET_ASYNC(`${longUrl}`)

        if(cachedUrl){
            let data = JSON.parse(cachedUrl)
            return res.status(201).send({status:true,message:"this url has already been shortend",data:data})
        }

        const urlCode = shortId.generate().toLowerCase();
        let baseUrl = "http://localhost:3000";

        const shortUrl = baseUrl + '/' + urlCode;

        req.body.shortUrl = shortUrl;
        req.body.urlCode = urlCode;

        await urlModel.create(req.body)
        let data = {};
        data.longUrl = longUrl;
        data.shortUrl = shortUrl;
        data.urlCode = urlCode

        await SET_ASYNC(`${longUrl}`, JSON.stringify(data))

        return res.status(201).send({ status: true, data: data }) 


    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


const getUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode;

        if (!shortId.isValid(urlCode)) {
            return res.status(400).send({ status: false, message: "enter valid code" })
        }
        let cachedUrl = await GET_ASYNC(`${urlCode}`)
        if (cachedUrl) {
            let data = JSON.parse(cachedUrl)
            return res.status(302).redirect(data)
        }
        else {
            let result = await urlModel.findOne({ urlCode })
            if (!result) {
                return res.status(404).send({ staus: false, message: "no url exists" })
            }
            let longUrl = result.longUrl
            await SET_ASYNC(`${longUrl}`, JSON.stringify(`${result}`)) //key
            await SET_ASYNC(`${urlCode}`, JSON.stringify(`${longUrl}`)) //key
            return res.status(302).redirect(longUrl)

        }

    } catch (err) {
        return res.status(500).send({ staus: false, error: err.message })
    }
}

module.exports.getUrl = getUrl
module.exports.shortUrl = shortUrl
