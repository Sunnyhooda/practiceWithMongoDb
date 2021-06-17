const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();
const port = 4200;
const mongoose = require('mongoose');

const databaseName = 'whatsDatabase'

const url = `mongodb://localhost:27017/${databaseName}`;

//Connection to mongodb
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
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
app.use('/css',express.static(path.resolve(__dirname,"public/css")))

//route for homepage
app.get('/', (req, res) => {
    Contact.find(function (err, result) {
        if (err) throw err;
        res.render("contactViews", { results: result })
    });
});

app.get('/contactadd', (req, res) => {
    res.render("contactAdd");
});

app.post('/savecontact', (req, res) => {
    var data = new Contact();
    data.contactId = req.body.id;
    data.contactName = req.body.name;
    data.contactNumber = req.body.number;

    data.save(function (err, res) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.redirect("/");
});

app.get('/contactdelete/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Contact.remove({contactId:id}, function (err, result) {
        if (err) throw err;
        console.log("1 document deleted");
    });
    res.redirect("/");
});

app.get('/contactedit/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
        Contact.findOne({contactId:id}, function (err, result) {
        if (err) throw err;
        console.log(result.contactId);
        res.render('contactEdit', {
            results: result
        });
    });
});


app.post('/updatecontact', (req, res) => {
   Contact.updateMany({contactId:req.body.id},{contactName:req.body.name},{contactNumber:req.body.number}, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});