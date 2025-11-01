import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import employeeRouter from './routes/employee.routes'

dotenv.config()


const app = express()

//MIddleware
app.use(express.json())
app.use(cors())

//Routes
app.use("/employees",employeeRouter)

//Fallback
app.use((req, res, next)=>{
    res.status(404).send("Page not found")
})

//start server
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}...`)
})