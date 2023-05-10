var express = require('express');
var router = express.Router();
const DB = require('../DBservices');


router.get('/db/journeys',async function(req, res, next) {
  const response = DB.find('Journeys',{})
  .then(res=>console.log(res))
  .catch(err=>console.log(err));
});
router.get('/db/feats/:featId',async function(req,res,next){
  console.log(req.params.featId);
  const response = DB.find('Feats',{"uuid":req.params.featId})
  .then(res=>{console.log("Feats are: ");console.log(res);})
  .catch(err=>console.log(err));
});

module.exports = router;