const express = require('express')
const router = express.Router()
const urlControllers = require('../controllers/urlController')




router.post('/url/shorten', urlControllers.createUrl)
router.get('/:urlCode',urlControllers.getUrl)

router.all('/*', function(req, res){
    res.status(404).send({status: false, message: 'path not found'})
})


module.exports = router

