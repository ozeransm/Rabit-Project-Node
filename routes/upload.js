var express = require('express');
var router = express.Router();
const cards = require('./main');
const path = require('path');
const multer = require('multer');
const uploadDir = path.join(process.cwd(), 'uploads');
const storeImage = path.join(process.cwd(), 'public/images');
const fs = require('fs/promises');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 2048576,
  },
});

const upload = multer({
  storage: storage,
});

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        status: 'ok'
    })
})

router.post('/', upload.array('files', 15), async function (req, res, next) {
    try {
        const fileJson = await cards.readFJ();
        req.body.id = `toy-${fileJson.cards.length}`;
        await fs.mkdir(path.join(storeImage, req.body.id), { recursive: true });
        fileJson.cards.push(req.body);
        req.body.img = [];

        await Promise.all(req.files.map(async (el, i) => {
            await fs.rename(path.join(uploadDir, el.filename), path.join(storeImage, req.body.id, el.filename));
            req.body.img[i] = `${path.join(req.body.id, el.filename)}`.replace(/\\/g, '/');
        }));

        await cards.writeFJ(fileJson);
        res.status(200).json({
            status: 'ok'
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;