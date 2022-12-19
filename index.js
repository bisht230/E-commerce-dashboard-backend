const express = require("express")
const cors = require('cors')
require('./db/config')
const User = require('./db/User')
const Product = require('./db/Product')
const app = express()

app.use(express.json())  //express.json() is the middleware which is used to give the body of the raw file
app.use(cors())
app.post("/signUp" , async (req,res) =>{
    const user = new User(req.body)
    let result = await user.save()
    result = result.toObject()
    delete result.password
    res.send(result)
})

app.post('/login' , async (req,res) =>{
       if(req.body.password && req.body.email){
       const user = await User.findOne(req.body).select('-password')
       if(user){
       res.send(user)
       }
       else{
         res.send({result : "No user found"})
       }
    }
    else{
        res.send({result : "Please enter valid automations"})
    }
})

app.post('/add-product' , async (req,res) =>{
      let product = new Product(req.body)
      let result = await product.save()
      res.send(result)
})

app.get('/products' , async (req,res) => {
   let allProducts = await Product.find()
   if(allProducts.length > 0){
      res.send(allProducts)
   }
   else{
      res.send('No product found')
   }
})

app.delete('/products/:id', async (req,res) => {
    const result = await Product.deleteOne({_id : req.params.id})   //Product.deleteOne({_id : req.params.id})
    res.send(result)
})

app.get('/products/:id' , async (req,res) => {
    let result = await Product.findOne({_id : req.params.id})
    if(result){
    res.send(result)
    }
    else{
        res.send({result : "No result found"})
    }
})

app.put('/products/:id' , async (req,res) =>{
    let result = await Product.updateOne(
        {_id : req.params.id} ,
        {
               // for update we use $set as an obj
                $set : req.body
        }
    )
    res.send(result)

})

app.get('/search/:key' , async (req,res) => {
    let result = await Product.find({
        '$or' : [
              {name : {$regex: req.params.key}},
              {company : {$regex : req.params.key}},
              {category : {$regex : req.params.key}}
        ]
    })
    res.send(result)
})
app.listen(5000)
