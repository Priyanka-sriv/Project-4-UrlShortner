const urlModel = require("../models/urlModel")
const shortId = require("shortid");
const validUrl = require('valid-url');



const createUrl = async function (req, res) {
    try {
        let longUrl = req.body.longUrl
        if (Object.keys(longUrl).length == 0) return res.status(400).send({ status: false, message: "please provide url" })
       

        if (!longUrl) {
            return res.status(400).send({ status: false, message: "longUrl is must be present" });
        }
        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, message: "please enter valid URL" })
        }
        //const urlCode = shortid.generate()
    
        let checkUrl = await urlModel.findOne({longUrl})
        if (checkUrl) {
            return res.status(400).send({ status: false, message: "URL already exist" })
        }
        const urlCode = shortId.generate()
        let baseUrl = "http://localhost:3000";

        const shortUrl = baseUrl + '/' + urlCode;

        req.body.shortUrl = shortUrl;
        req.body.urlCode = urlCode;

      let arsad =  await urlModel.create(req.body)
        let data ={};
        data.longUrl = longUrl;
        data.shortUrl = shortUrl;
        data.urlCode =urlCode
  //data.isSelected

           return res.status(200).send({status:true,message:"sucessfully crated", data:data})
        
        
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

const getUrl = async function(req,res){
try{
let urlCode = req.params.urlCode;

let result = await urlModel.findOne({urlCode}).select({longUrl:1})
//return res.status(200).send({status:true,message:result.longUrl})
res.status(302).redirect(result.longUrl)

}catch(err){
return res.status(500).send({staus:false,error:err.message})
}
}

module.exports.getUrl = getUrl
module.exports.createUrl = createUrl
