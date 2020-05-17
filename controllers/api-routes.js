const db = require('../models')
const router = require('express').Router()
const iplocate = require('node-iplocate')

const ip = async (req) => {
  const address =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  if (address && address.includes(',')) {
    return iplocate(address.split(',')[0].trim())
  }
  return iplocate(address)
}

router.get('/volunteers', function (req, res) {
  db.Volunteer.findAll()
    .then(volunteer => res.status(200).json({ data: volunteer }))
    .catch(err => {
      console.log(err)
      res.status(500).json({ errors: [err] })
    })
})

router.post('/volunteers', function (req, res) {
  db.Volunteer.create(req.body)
    .then(volunteer => res.status(201).json({ data: volunteer }))
    .catch(err => {
      console.log(err)
      res.status(500).json({ errors: [err] })
    })
})

router.post('/patients', async function (req, res) {
  const body = req.body
  const { longitude, latitude } = await ip(req)
  db.Patient.create({ ...body, longitude, latitude })
    .then(patient => res.status(201).json({ data: patient }))
    .catch(err => {
      console.log(err)
      res.status(500).json({ errors: [err] })
    })
})

module.exports = router
