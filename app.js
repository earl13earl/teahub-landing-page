const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { response } = require("express");
const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "earljhon@_13",
	database: "nodedb",
});

conn.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Database connected");
	}
});

app.get("/", (req, res) => {
	res.render("home", { msg: "The sytem is ready to take your info." });
});

app.post("/", (req, res) => {
	var data = {
		productCode: req.body.productCode,
		productName: req.body.productName,
		productDescription: req.body.productDescription,
		productPrice: req.body.productPrice,
		productSize: req.body.productSize,
	};

	var sql = "Insert into nodedb set ?";
	var query = conn.query(sql, data, (err, rset) => {
		if (err) {
			console.log(err);
			res.render("home", { msg: "Error inserting your data." });
		} else {
			res.redirect("/listusers");
		}
	});
});


app.get("/landing",(req,res) => {
	res.render("landing",{
		msg : "Enter Username and Password"
	})
})

app.post("/landing", (req,res) =>{
	var username = req.body.username
	var passw = req.body.passw
	var sql = "select * from useraccount where username= ?"
	var query = conn.query(sql,username,(err,rset)=>{
		if (err) {
			console.log(err)
			res.render("landing", {
				msg : "Error authenticating your credentials"
			})
		} else {
			if (rset.length==0){
				res.render("landing", {
					msg : "Wrong password or username"
				})
			} else {
				if (passw == rset[0].password) {
					res.redirect("/listusers")
				} else {
					res.render("landing", {
						msg : "Wrong password"
					})
				}
			}
		}
	})
})

app.get("/listusers", (req,res) => {
	const productCode = req.params.productCode
	console.log("listroute")
	let sql = "select * from nodedb"
	let query = conn.query(sql,(err, rset) => {
		if (err) {
			console.log(err)
		} else {
			res.render("listusers",{rset})
		}
	})
})

app.get("/delete/:productCode", (req,res) => {
	const productCode = req.params.productCode
	let sql = "DELETE from nodedb where productCode = ?"
	let query = conn.query(sql,productCode,(err, rset) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect("/listusers")
		}
	})
})

app.get("/edit/:productCode", (req,res) => {
	// console.log(req)

	const productCode = req.params.productCode
	console.log(productCode+"productCode")

	console.log("editroute")
	let sql = "select * from nodedb where productCode = ?"
	let query = conn.query(sql,productCode,(err, rset) => {
		if (err) {
			console.log(err)
		} else {
			res.render("useredit",{rset})
		}
	})
})



app.post("/update", (req,res) => {
	

	let	productCode = req.body.productCode
	let	productName = req.body.productName
	let	productDescription = req.body.productDescription
	let	productPrice = req.body.productPrice
	let	productSize = req.body.productSize
	console.log(res.body)
	console.log(req.body)
	let sql = "UPDATE nodedb set productName=?, productDescription=?,productPrice=?, productSize=? where productCode=?"
	let query = conn.query(sql,[productName, productDescription,productPrice,productSize, productCode],(err, rset) => {
		if (err) {
			console.log(err)
		} else {
			console.log("okay")
			res.redirect("/listusers") 
		}
	})
})

app.get("/userReg",(req,res) => {
	res.render("userReg",{
		msg : "Enter Username and Password"
	})
})
app.post("/userReg", (req, res) => {
	var data = {
		password: req.body.password,
		username: req.body.username,
	};

	var sql = "Insert into useraccount set ?";
	var query = conn.query(sql, data, (err, rset) => {
		if (err) {
			console.log(err);
			res.render("userReg", { msg: "Error inserting your data." });
		} else {
			res.render("userReg", { msg: "One record was inserted." });
		}
	});
});

app.get("/landing",(req,res) => {
	res.render("landing",{
	})
})


app.listen(port, () => {
	console.log("server is running...");
});