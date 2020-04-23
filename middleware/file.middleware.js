const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join('public', 'avatars'))
  },
  filename(req, file, cb) {
    cb(null, `${+new Date()}-${file.originalname}`)
  }
})

const allowedTypes = ['image/png', 'image/jpeg']

const fileFilter = (req, file, cb) => {
  cb(null, allowedTypes.includes(file.mimetype))
}

module.exports = multer({ storage, fileFilter })
