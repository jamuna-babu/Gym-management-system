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
var record ={"Name":data.name,"username":data.username,"password":data.password,"password2":data.password2,"phno":data.phno}
dbConn.then(function(db) {
var dbo=db.db("powerzone");
//delete req.body._id; // for safety reasons
dbo.collection('programs').insertOne(record);
});
res.send('Data received:\n' + JSON.stringify(record));
});

 app.get("/", (req, res) => {
    res.sendFile(__dirname + "/trial.html");
});
app.get('/all',function(req,res){
    dbConn.then(function(db) {
        var dbo=db.db("powerzone");
        dbo.collection("programs").find({},
        {"name":1,"username":0,"password":0,"password2":0,"phno":0}).toArray(function(err,result) {
        if (err) throw err;
        console.log(result);
        //res.send('All records:\n\n' + JSON.stringify(result));
        res.render('alpug', {result:result});
        });
        //var reco=dbo.collection('creditcard').find({});
        //console.log(reco);
        });
        });

        app.post('/delete', function (req, res) {
            dbConn.then(function(db) {
            var dbo=db.db("powerzone");
            var data=req.body.delname;
            var myquery = { Name: data };
            dbo.collection("programs").deleteMany(myquery, function(err,obj) {
            if (err) throw err;
            console.log(req.body.delname + " document(s) deleted");
            res.send(req.body.delname + " document(s) deleted");
            //db.close();
            });
            });
            });
            app.post('/update', function (req, res) {
            dbConn.then(function(db) {
            var dbo=db.db("powerzone");
            var myquery = {Name:req.body.oldname};
            console.log(req.body.oldname)
            console.log(req.body.newname)
            var newvalues = {$set:{Name:req.body.newname}};
            dbo.collection("programs").updateOne(myquery, newvalues,function(err, obj) {
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