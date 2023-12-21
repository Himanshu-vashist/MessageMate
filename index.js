const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path = require("path");
const Chat=require("./Models/chat.js");
const methodOverride=require("method-override");
const bcrypt = require('bcrypt');
const ejsMate=require("ejs-mate");
const messages = [];
const ExpressError=require("./ExpressError");




app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
.then(()=>{
    console.log("connection succesfull");
})
.catch((err)=>console.log(err));

async function main (){
    await mongoose.connect("mongodb://127.0.0.1:27017/chatbox");
}


//using WrapAsync
function asyncWrap(fn){
  return function (req,res,next){
    fn(req,res,next).catch((err)=>next(err));
  };
}

app.get("/",asyncWrap(async(req,res)=>{
  res.render("login.ejs");
 })
);

 app.get("/login", asyncWrap(async (req, res) => {
     res.render("login.ejs");
  })
 );
 
app.post("/login",
   
  async(req,res)=>{
      
      res.redirect("/listings");
      
      

  });


app.get("/skip", asyncWrap(async (req, res) => {
     let chats = await Chat.find();
      console.log(chats); 
      res.render("messagemate.ejs", {chats});
})  
);

app.get("/chats", asyncWrap(async (req, res) => {
 
      let chats = await Chat.find();
      console.log(chats); // Check the retrieved data in the console
      res.render("messagemate.ejs", { chats });
  })
);


//New Route
app.get("/chats/new",asyncWrap(async (req,res)=>{
      let chats = await Chat.find();
          console.log(chats);
      res.render("new.ejs",{ chats });
  })
);


//CREATE Route
app.post("/chats",asyncWrap(async (req, res) => {
  
    // Handle the data from the POST request (e.g., save it to the database)
    const { from, message, to } = req.body;

    // Save the chat message to the database using the Chat model
    const newChat = new Chat({ from, message, to });
    await newChat.save();

    // After handling the data, redirect the user to the "/chats" page to see the updated list of chats
    res.redirect("/chats");
  })
);

//Edit Route

app.get("/chats/:id/edit",asyncWrap(async(req,res)=>{
let {id}=req.params;
let chat= await Chat.findById(id);
res.render("edit.ejs",{ chat: chat });
})
);

//updata route
app.put("/chats/:id",asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let {message : newMessage}=req.body;
    let updatedChat=await Chat.findByIdAndUpdate(id,{message : newMessage},{runValidators:true,new:true});
    console.log(updatedChat);
    res.redirect("/chats");
})
);

//destroy route
app.delete("/chats/:id",asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let deletedChat=await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
})
);

app.get("/chats/:messageMate", asyncWrap(async (req, res) => {
      let chats = await Chat.find();
      console.log(chats); // Check the retrieved data in the console
      res.render("messagemate.ejs", { chats });
  })
);

//game route
app.get("/game",(req,res)=>{
  res.render("game.ejs");
});

//play button 
app.get("/play",(req,res)=>{
  res.render("guess_the_number_game.ejs");
});

//playwordgame
app.get("/playword",(req,res)=>{
  res.render("wordgame.ejs");
});


//solitairegame
app.get("/CheckboxGame",(req,res)=>{
  res.render("CheckboxGame.ejs");
});

//rock-paper game
app.get("/rockpaper",(req,res)=>{
  res.redirect("https://himanshu-vashist.github.io/Rock-Paper-Scissors-Game/");
})

//chatroom
app.get('/send', (req, res) => {
  res.render('messagemate.ejs', { messages });
});

app.post('/send', (req, res) => {
      const message = req.body.message;
       res.redirect('/send');
});

//homepage
app.get("/homepage", asyncWrap(async (req, res) => {
      let chats = await Chat.find();
      console.log(chats); 
      res.render("messagemate.ejs", { chats });
  })
);

//Mongoose Errors
const handleValidationErr=(err)=>{
  console.log("Validation error occurred");
  console.dir(err.message);
  return err;
};
app.use((err,req,res,next)=>{
  console.log(err.name);
  if(err.name==="ValidationError"){
    err=handleValidationErr(err);
  }
  next(err);
});

//Error Handling Middleware
  app.use((err,req,res,next)=>{
    let { status=500, message="SOME ERROR" }=err;
    res.status(status).send(messages);
  })

app.listen(8080,()=>{
    console.log('Listening on port 8080');
});