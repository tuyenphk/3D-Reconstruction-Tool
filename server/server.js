const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')

const {uploadImage,downloadObj} = require('./helpers/helpers')
const spawnExec = require('./helpers/spawnExec')

const app = express()

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(cors());
app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
  try {
    console.log ("requested receive")
    const imageUrl = await uploadImage(req.body)

    res
      .status(200)
      .json({
        message: "Upload was successful",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }
})

app.post('/downloadObj', async (req, res, next) => {
  try {
    const url = await downloadObj(req.body.filename)

    res
      .status(200)
      .json({
        message: "Download was successful",
        data: url
      })
  } catch (error) {
    next(error)
  }
})

// render
app.post('/render1', async (req, res, next) => {
  try {
    console.log ("requested receive")
    // grab imageUrl
    const objFilename = await spawnExec(req.body)
    /*
    // download image to local -- download script

    // spawn child process (pass in image name)
    
    // grab obj file from stdout

    // upload objFile to bucket  -- upload script

    // return objUrl file
    // 

    */
    console.log ("finished render %s",objFilename)
    res
      .status(200)
      .json({
        message: "Render was successful",
        data: outPut
      })
  } catch (error) {
    next(error)
  }
})


app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})

app.listen(9001, () => {
  console.log('app now listening for requests!!!')
})
