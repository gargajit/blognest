import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


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

app.get("/create", (req,res) => {
    const name_of_author = auth;
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let current = `${day}-${month}-${year}`;
    const uniqueId = Date.now();
    res.render("create.ejs", 
        { author: name_of_author, currentDate: current, id: uniqueId }
    );
});

app.get("/view", (req, res) => {
    res.render("view.ejs");
});

app.post("/blog-:id", (req, res) => {
    const blogId = req.params.id;

    const title = req.body["createBlogTitle"];
    const author = req.body["author"];
    const date = req.body["currentDate"];
    const content = req.body["createBlogBody"];

    const filePath = path.join(__dirname, 'views', 'blogs', `blog-${blogId}.ejs`);

    const ejsContent = `
    <%- include("../partials/header.ejs") %>
    
    <h1><%= title %></h1>
    <p class="author_details"><%= author %>, <%= date %></p>
    <div><%= content %></div>
    
    <%- include("../partials/footer.ejs") %>
    `;

    fs.writeFile(filePath, ejsContent, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Internal Server Error");
        }

        console.log(`Blog ${blogId} submitted and saved successfully as an EJS file!`);
        console.log(`File path: ${filePath}`);

        // Ensure the file exists before rendering
        fs.access(filePath, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
                console.error("File does not exist:", accessErr);
                return res.status(500).send("File not found, unable to render the blog.");
            }

            res.render(`blogs/blog-${blogId}.ejs`, {
                title: title,
                author: author,
                date: date,
                content: content
            });
        });
    });
});



app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
