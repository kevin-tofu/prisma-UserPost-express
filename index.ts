// const express = require('express')
import express from 'express';
import { Request, Response } from 'express'
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use('/', require('./functions/router.ts'))

app.get('/status', ( req: Request, res: Response ) => {
    res.send('ok');
} );

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
exports.module = app