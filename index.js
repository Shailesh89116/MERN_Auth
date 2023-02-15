require('dotenv').config({path:"./config.env"})
const express=require('express');
const connectDB=require("./config/db");
const errorHandler=require("./middleware/error")
const cors=require('cors');

const app=express();

connectDB();

app.use(express.json());
app.use(cors()) 
 // allow us to get data from the body

app.use('/api/auth',require('./route/auth'));
app.use('/api/private',require('./route/private'));

//Error Handler should be last 
app.use(errorHandler);


const PORT=process.env.PORT;


const server=app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});

process.on("unhandledRejection",(err,Promise)=>{
    console.log(`Logged error:${err}`);
    server.close(()=>{process.exit(1)});
})

