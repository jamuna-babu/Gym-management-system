var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017/node-demo',{
useNewUrlParser: true,
useUnifiedTopology: true
});
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine','pug');
app.post('/submit', function (req, res) {
var data=req.body;
var cardno= data.cardno1+data.cardno2+data.cardno3+data.cardno4;
var record ={"Name":data.name,"CardNo":cardno,"Month":data.month_id,"Year":data.year_id,"CVV":data.cvv}
dbConn.then(function(db) {
var dbo=db.db("webprog");
//delete req.body._id; // for safety reasons
dbo.collection('creditcard').insertOne(record);
});
res.send('Data received:\n' + JSON.stringify(record));
});

 app.get("/", (req, res) => {
    res.sendFile(__dirname + "/CreditCard.html");
});
app.get('/all',function(req,res){
    dbConn.then(function(db) {
        var dbo=db.db("webprog");
        dbo.collection("creditcard").find({},
        {"Name":1,"CardNo":0,"Month":0,"Year":0,"CVV":0}).toArray(function(err,result) {
        if (err) throw err;
        console.log(result);
        //res.send('All records:\n\n' + JSON.stringify(result));
        res.render('allpug', {result:result});
        });
        //var reco=dbo.collection('creditcard').find({});
        //console.log(reco);
        });
        });

        app.post('/delete', function (req, res) {
            dbConn.then(function(db) {
            var dbo=db.db("webprog");
            var data=req.body.delname;
            var myquery = { Name: data };
            dbo.collection("creditcard").deleteMany(myquery, function(err,obj) {
            if (err) throw err;
            console.log(req.body.delname + " document(s) deleted");
            res.send(req.body.delname + " document(s) deleted");
            //db.close();
            });
            });
            });
            app.post('/update', function (req, res) {
            dbConn.then(function(db) {
            var dbo=db.db("webprog");
            var myquery = {Name:req.body.oldname};
            var newvalues = {$set:{Name:req.body.newname}};
            dbo.collection("creditcard").updateOne(myquery, newvalues,
            function(err, obj) {
            if (err) throw err;
            else{
            console.log("1 document updated");
            res.send("1 document updated");
            }
            });
        });
    });
    app.listen(3000,function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT",3000);
    });