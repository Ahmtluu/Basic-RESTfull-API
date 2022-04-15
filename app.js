const express = require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");

const app= express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/articleDB", {useNewUrlParser:true});

const PORT = process.PORT || 3000

const articleSchema = {
    title:String,
    content:String
};
const Article=mongoose.model("Article", articleSchema);

app.route("/article")
.get(function(req,res){
    Article.find({}, (err, result)=>{
        if(!err){
            res.send(result);
        }else{
            res.send(err);
        }
    });
})
.post(function(req,res){
    const newArticle=Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Completed!!");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany({}, (err)=>{
        if(!err){
            res.send("Collection deleted with success")
        }else{
            res.send(err)
        }
    });
});

///Specific Article
app.route("/article/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}, (err,result)=>{
        if(!err){
            res.send(result);
        }else{
            res.send(err);
        }
    })
})
.patch(function(req,res){
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article")
            }else{
                res.send(err);
            }
        });
})
.delete(function(req,res){
    Article.findOneAndDelete(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted article")
            }else{
                res.send(err);
            }
        }
    )
});

app.listen(PORT, ()=>{
    console.log(`Server is runnin on ${PORT}`);
});
