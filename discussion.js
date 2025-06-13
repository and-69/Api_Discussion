import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import router from './routes/rutas.js'

const discussion= express()
discussion.use(express.json()) 
discussion.use(express.static('public'));
discussion.use('/api', router)

mongoose.connect(process.env.MONGO_CNX)
  .then(() => console.log('Connected to BD'))
  .catch(err => console.error('Error al conectar',err));
  
discussion.listen(process.env.PORT, () => {
    console.log(`Listening the port ${process.env.PORT}`);
})