const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();
const port = 4200;
const mongoose = require('mongoose');

const databaseName = 'contactWhatsApp'

const url = `mongodb://localhost:27017/${databaseName}`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });



const dbo = mongoose.connection;
dbo.on('error', console.error.bind(console, 'connection error:'));
dbo.once('open', function () {
    console.log("We are connected")
    // we're connected!
});

//Schema defined
const contactSchema = new mongoose.Schema({
    contactId: { type: Number, required: true },
    contactName: { type: String, required: true },
    contactNumber: { type: Number, required: true }
})

//collection created
const Contact = new mongoose.model("Contact", contactSchema);

//set view file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set public folder as static folder for static files
app.use('/assets', express.static(__dirname + '/public'));

//route for homepage
app.get('/', (req, res) => {
    var mysort = { name: 1 };
    dbo.collection("Contact").find().sort(mysort).toArray(function (err, result) {
        if (err) throw err;
        res.render("contactViews", { results: result })
    });
});

app.get('/contactadd', (req, res) => {
    res.render("contactAdd");
});

app.post('/savecontact', (req, res) => {
    let data = { contactId: req.body.id, contactName: req.body.name, contactNumber: req.body.number };
    dbo.collection("Contact").insertOne(data, function (err, res) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.redirect("/");
});

app.get('/contactdelete/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    var myquery = { contactId: id }
    dbo.collection("Contact").deleteOne(myquery, function (err, result) {
        if (err) throw err;
        console.log("1 document deleted");
    });
    res.redirect("/");
});

app.get('/contactedit/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    var obj = { "contactId": id };
    dbo.collection("Contact").findOne(obj, function (err, result) {
        if (err) throw err;
        console.log(result.contactId);
        res.render('contactEdit', {
            results: result
        });
    });
});

app.post('/updatecontact', (req, res) => {
    let data = { contactId: req.body.id, contactName: req.body.name, contactNumber: req.body.number };
    var myquery = { contactId: req.body.id };
    var newvalues = { $set: { contactName: req.body.name, contactNumber: req.body.number } };
    dbo.collection("Contact").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});