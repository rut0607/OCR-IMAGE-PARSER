const express        = require('express');
const router         = express.Router();
const upload         = require('../middleware/upload');
const { extractData } = require('../controllers/extractController');

router.post('/extract', upload.single('image'), extractData);

module.exports = router;