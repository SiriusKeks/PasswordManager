const express = require("express");
const app = express ();
const mysql = require ("mysql");
const cors = require ("cors");
const PORT = 3001;

const {encrypt, decrypt} = require('./EncryptionHandler');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "passwordmanager",
});

app.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, password], (err,result) => {
        console.log(err);
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err,result) => {
        
        if (err) {
        res.send({err: err});
        }

        if (result.length > 0) {
            res.send({result});
        } else {
            res.send({message: "Wrong username/password combination!"});
        }
    });
});

app.post("/addpassword", (req, res) => {
    const {password, title} = req.body;
    const hashedPassword = encrypt(password);
    db.query(
        "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)", 
        [hashedPassword.password, title, hashedPassword.iv],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        }
    );

});

app.get("/showpasswords", (req, res) => {
    db.query('SELECT * FROM passwords', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

app.listen(PORT, () => {
    console.log("Server is running");
});