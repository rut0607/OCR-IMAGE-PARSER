const sharp = require('sharp');

const cropImage = async (req, res) => {
  try {
    // 1. Check image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    // 2. Parse and validate crop parameters
    const x      = parseInt(req.body.x, 10);
    const y      = parseInt(req.body.y, 10);
    const width  = parseInt(req.body.width, 10);
    const height = parseInt(req.body.height, 10);

    if ([x, y, width, height].some(isNaN)) {
      return res.status(400).json({ error: 'x, y, width, and height are all required.' });
    }
    if (x < 0 || y < 0) {
      return res.status(400).json({ error: 'x and y must be ≥ 0.' });
    }
    if (width <= 0 || height <= 0) {
      return res.status(400).json({ error: 'width and height must be > 0.' });
    }

    // 3. Get image metadata so we can clamp to actual bounds
    const image    = sharp(req.file.buffer);
    const metadata = await image.metadata();
    const imgW     = metadata.width;
    const imgH     = metadata.height;

    // 4. Clamp crop region so it never exceeds image bounds
    const safeX      = Math.min(x, imgW - 1);
    const safeY      = Math.min(y, imgH - 1);
    const safeWidth  = Math.min(width,  imgW - safeX);
    const safeHeight = Math.min(height, imgH - safeY);

    // 5. Crop and return buffer
    const outputBuffer = await image
      .extract({ left: safeX, top: safeY, width: safeWidth, height: safeHeight })
      .toBuffer();

    // 6. Send back same format as input
    const mimeType = req.file.mimetype; // 'image/jpeg' or 'image/png'
    res.set('Content-Type', mimeType);
    res.send(outputBuffer);

  } catch (err) {
    console.error('Crop error:', err);
    res.status(500).json({ error: 'Failed to process image.' });
  }
};

module.exports = { cropImage };