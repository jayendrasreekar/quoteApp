const express = require("express");
const bodyParser = require("body-parser");

//use mongo clients connect method to connect to mongo db
const MongoClient = require("mongodb").MongoClient;
var quotesCollection;
var db;
const app = express();

app.listen(3000,function(){
	console.log("Listening on 3000");
});


//tell Express to make this public folder accessible to the public by using a built-in middleware 
//called express.static
app.use(express.static("public"));

// need to place app.set before use,get post
app.set("view engine","ejs");


//body parsers comes before CRUD handlers
//The urlencoded method tells body-parser to extract data from the <form> 
//element and add them to the body property in the request object.
app.use(bodyParser.urlencoded({ extended: true }));
//server doesn't accept JSON data yet. We can teach it to read JSON by adding the body-parser's json middleware.
app.use(bodyParser.json());


// app.get("/",(req,res) => {
//  res.send("This is just the beginning");
// });

app.get("/",(req,res)=> {
	const cursor = db.collection("quotes")
	.find()
	.toArray()
	.then((results)=>{
		//console.log(results);
		res.render("index.ejs",{quotes:results})
	})
	.catch((error)=> console.log(error));

	//view is the name of file we are rendering, this file must be in views folder. locals is data passed into the file
	//res.sendFile(__dirname+"/index.html");
});


app.post("/quotes",(req,res) => {
	//console.log("Hellooo Dud this works");
	quotesCollection
	.insertOne(req.body)
	.then((result)=>{
		//console.log("here it is ****" +result);
		res.redirect("/");
	})
	.catch((error)=>console.log(error));
	//console.log(req.body);
});

app.put("/quotes", (req, res) => {
  // console.log("here"+req.body);
  //  .findOneAndUpdate(query, update, options)
	  quotesCollection
	  .findOneAndUpdate(
	  	//query lets us filter the collection with key-value pairs. If we want to filter quotes to those written by Yoda, we can set { name: 'Yoda' } as the query.
	    { name: "Jon Snow" },
	    {
	    //update, tells MongoDB what to change. It uses MongoDB's update operators like $set, $inc and $push.
	      $set: {
	        name: req.body.name,
	        quote: req.body.quote,
	      },
	    },
	    {
	    //options : upsert to true
	      upsert: true,
	    }
	  )
	  .then((result) => {
	     res.json('Success');
	  })
	  .catch((error) => console.error(error));
});

app.delete("/quotes", (req, res) => {
   quotesCollection // can also use remove ?
  .deleteOne({ name: req.body.name })
  .then((result) => {
  	if (result.deletedCount === 0) {
        return res.json("No quote to delete");
    }
    res.json(`Deleted the silly fellow`);
  })
  .catch((error) => console.error(error));
});

//mongodb+srv://<user>:<user>@cluster0-dzeu5.gcp.mongodb.net/test?retryWrites=true&w=majority
const connectionString = "mongodb+srv://user:user@cluster0-dzeu5.gcp.mongodb.net/test?retryWrites=true&w=majority";

//Without prmomises
// MongoClient.connect(connectionString,{useUnifiedTopology : true}, (err, client) => {
//   if (err) return console.error(err);
//   console.log("Connected to Database");
// });


//With Promises
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    db = client.db("got-quotes");
    quotesCollection = db.collection("quotes");
  })
  .catch((error) => console.error(error));




