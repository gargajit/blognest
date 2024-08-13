import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let auth;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/home", (req, res) => { 
    auth = req.body["auth"];
    res.render("home.ejs", 
        { author: auth }
    );
});

app.post("/create", (req,res) => {
    const name_of_author = auth;
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let current = `${day}-${month}-${year}`;
    res.render("create.ejs", 
        { author: name_of_author, currentDate: current }
    );
});

app.post("/view", (req, res) => {
    res.render("view.ejs");
});


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
