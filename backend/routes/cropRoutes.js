const express    = require('express');
const router     = express.Router();
const upload     = require('../middleware/upload');
const { cropImage } = require('../controllers/cropController');

router.post('/crop', upload.single('image'), cropImage);

module.exports = router;