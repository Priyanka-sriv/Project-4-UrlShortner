const express = require('express')
const router = express.Router()
const urlControllers = require('../controllers/urlController')


router.get("/test/me",function(req,res){
    res.send("my first API")
})

router.post('/url/shorten', urlControllers.createUrl)
router.get('/get/:urlCode',urlControllers.getUrl)

router.all('/*', function(req, res){
    res.status(400).send({status: false, message: 'Url Wrong'})
})


module.exports = router

