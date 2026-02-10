const express = require("express");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const validator = require("validator");
const { type } = require("os");

const port = 8000;
const app = express();

app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))

app.set("view engine", 'ejs');
app.set('views',path.resolve('./views'));

mongoose.connect("mongodb://127.0.0.1:27017/Customer");
const db = mongoose.connection
db.once("open",()=>{
    console.log("mongodb connection successfully");
})
const customerSchema = new mongoose.Schema({
customer : String,
phone : String,
gmail :String,
address : String,
adhar :{
    type: String,
    required: true,
    unique: true,
},
image : String,

});

const tefeenSchema = new mongoose.Schema({
Date:String,
Quantity:Number,
Customer:String,
Amount:Number,

});

const paySchema = new mongoose.Schema({
Date:String,
Amount:Number,
Customer:String,
});
const payDetail = mongoose.model("payment", paySchema);
const tefeenDetail = mongoose.model("tefeen",tefeenSchema);
const customerDetail = mongoose.model("customer",customerSchema);
const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        return cb (null, "./image");
    },
    filename: function (req, file, cb){
        return cb(null, `${file.originalname}`);
    },
});

const upload = multer({storage});

app.listen(port,()=>{
    console.log("server started");
});

app.post("/admin2", async(req,res)=>{
    const payment = new payDetail({
        Date:req.body.Date,
        Amount:req.body.Amount,
        Customer:req.body.customer,
    });
    await payment.save();
    let data = await customerDetail.find({});
    let s = 4;
    return res.render("admin" ,{
        Data : data,
        len : s,
    });
})

app.post("/admin1", async(req,res)=>{
    const tefeen = new tefeenDetail({
        Date:req.body.Date,
        Quantity:req.body.Quantity,
        Customer:req.body.customer,
        Amount:(req.body.Quantity)*50,
    });
    await tefeen.save();
    let data = await customerDetail.find({});
    let s = 4;
    return res.render("admin" ,{
        Data : data,
        len : s,
    });
})

app.post("/newData", upload.single("Photo"), async(req,res)=>{
   const customer = new customerDetail({
    customer:req.body.Customer,
    phone:req.body.Phone,
    gmail:req.body.Gmail,
    address:req.body.Address,
    adhar:req.body.Aadhar,
    image:req.file.path,
   });
   await customer.save();
   let data = await customerDetail.find({});
    let s = 4;
    return res.render("admin" ,{
        Data : data,
        len : s,
    });
});

app.get('/',(req,res)=>{
    return res.render("main");
});

app.post('/search',async(req,res)=>{
    let data = await customerDetail.findOne({customer: req.body.Customer});
     let tefeen = await tefeenDetail.find({Customer: req.body.Customer});
     let payment = await payDetail.find({Customer: req.body.Customer});
    return res.render("search" ,{
        Data : data,
        Tefeen:tefeen,
        Pay:payment,
    });
})




app.post('/admin3',async(req,res)=>{
    if((req.body.customer === 'nayak')&&(req.body.passward === '251301')){
    let data = await customerDetail.find({});
    let s = 4;
    return res.render("admin" ,{
        Data : data,
        len : s,
    });
}
else{
    return res.render("main");
}
})



app.get('/newCus',(req,res)=>{
    return res.render("newcus");
});






