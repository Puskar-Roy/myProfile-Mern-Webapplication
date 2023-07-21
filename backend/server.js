const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const dotenv = require('dotenv'); 
const router = require('./router/route.js')
const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
dotenv.config()
app.disable("x-powered-by");
app.use('/api',router);
require('./database/connectDb')




app.listen(process.env.PORT,()=>{
    console.log("server start at port " + process.env.PORT);
})