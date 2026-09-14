import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

const connectDB = (await import("./db/index.js")).default;
const app = (await import("./app.js")).default;

connectDB()
.then(()=>{
        app.listen(process.env.PORT || 8000,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
.catch((err)=>{
    console.log("MONGO DB CONNECTION ERROR",err);
    throw err;
})




















// import express from "express";
// const app = express();

// ;( async()=> {
//     try{
//        await mongoose.connect('${process.env.MONGODB_URI}/${DB_NAME}');
//        app.on("error",(err)=>{
//         console.log("Error",err);
//         throw err;
//        });
//        app.listen(process.env.PORT,()=>{
//         console.log(`Server is running on port ${process.env.PORT}`);
//        });
//     } catch(err){
//         console.log("Error",err);
//         throw err;
//     }
// })();




