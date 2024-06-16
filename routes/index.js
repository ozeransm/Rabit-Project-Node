var express = require('express');
var router = express.Router();
const cards = require('./main');

async function writeF(body, del=0) {
  
  const fileJson = await cards.readFJ();
  

  switch (del) {
    case 0:
      if (fileJson.cards.find((el) => el.id === `toy-${body.id}`)) {
        fileJson.cards[body.id].name = body.name;
        fileJson.cards[body.id].price = body.price;
        fileJson.cards[body.id].description = body.description || 'description';
        cards.writeFJ(fileJson);
      }
      break;
      case 1:
        const newFileJson = fileJson.cards.filter((el) => el.id !== `toy-${body.id}`);
        cards.writeFJ({
          cards: [...newFileJson.map((el, i) => {
            el.id = `toy-${i}`;
            return newFileJson[i];
          })]
        });
      
      break;
    
    default: break;
  }
  
}

  
router.get('/', async function (req, res, next) {
  const fileJson = await cards.readFJ();
  res.status(200);
  res.json(fileJson);
  
});

router.post('/', function (req, res, next) {
  
  writeF(req.body);
  res.status(200);
  res.json({
    status: 'ok'
  })
  
});

router.delete('/', function (req, res, next) {
  writeF(req.body, 1);
  res.status(200);
  res.json({
    status: 'ok'
  })

})


module.exports = router;