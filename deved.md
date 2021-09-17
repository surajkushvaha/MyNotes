**_ Install this for backend _**
| all installable things |
| ---------------------  |
|`npm init`|
| Express provides methods to specify what function is called for a particular HTTP verb ( GET , POST , SET , etc.) and URL pattern ("Route"), and methods to specify what template ("view") engine is used, where template files are located, and what template to use to render a response |
|`npm install express`|
|run js in cmd ( note: in package.json> script :{ "start":"nodemon mainfilename.js"})|
|`npm install nodemon`|
|for mongodb|
|`npm install mongoose`|
|to hide from code|
|`npm install dotenv`|
|parse to json|
|`npm install body-parser`|
|to crossplatform|
|`npm install cors`|

## required to import ##
```
const express = require("express"); => importing express
const mongoose = require("mongoose"); => importing mongoose for db
```

## middlewares ##
```
import express here app as express (const variable = express())
app.use(cors()); =>(for cross platform)
app.use(express.json()); =>(json formatter)
```

## routing things ##
```
const postRoutes = require("./routes/posts");
app.use("/posts", postRoutes); =>(for routing)

### in posts.js (in routes folder) ###

const express = require("express");
const router = express.Router();
```
## connect to DB ##
```
const mongoose = require("mongoose"); 
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("connected to mongo");
});
```

## How to we start listening the server ##
```
app.listen(port);
```

## import in route's file ##
```
const express = require("express");
const router = express.Router();
const Posts = require("../models/Posts");
```

## get method ##
```
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});
```

## post method ##
```
router.post("/", async (req, res) => {
  const post = new Posts({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});
```

## delete method ##
```
router.delete("/:postID", async (req, res) => {
  try {
    const deletePost = await Posts.deleteOne({ _id: req.params.postID });
    res.json(deletePost);
  } catch (err) {
    res.json({
      message: err,
    });
  }
});
```

## update/patch method ##
```
router.patch("/:postID", async (req, res) => {
  try {
    const updatedPost = await Posts.updateOne(
      { _id: req.params.postID },
      { $set: { title: req.body.title } }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json({
      message: err,
    });
  }
});
```

## main file code (here app.js) ##
```
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv/config");
//import routes
const postRoutes = require("./routes/posts");

//middlewares
app.use(cors());
app.use(express.json());
app.use("/posts", postRoutes);

//routes
app.get("/", (req, res) => {
  res.send("we are in home");
});

mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("connected to mongo");
});

//How to we start listening the server
app.listen(3000);
```

## example of make schema (in model folder model-Posts.js) ##
```
const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Posts", postSchema);
```

## example of main code (posts.js in routes folder) ##
```
const express = require("express");
const router = express.Router();
const Posts = require("../models/Posts");

//get back all the osts
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

//submit the posts
router.post("/", async (req, res) => {
  const post = new Posts({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

//specific post
router.post("/:postID", async (req, res) => {
  try {
    const post = Posts.findById(req.params.postID);
    res.json(post);
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//delete post
router.delete("/:postID", async (req, res) => {
  try {
    const deletePost = await Posts.deleteOne({ _id: req.params.postID });
    res.json(deletePost);
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//updated post
router.patch("/:postID", async (req, res) => {
  try {
    const updatedPost = await Posts.updateOne(
      { _id: req.params.postID },
      { $set: { title: req.body.title } }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json({
      message: err,
    });
  }
});
module.exports = router;
```
