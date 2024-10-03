//server.js

const express = require('express')
const dotenv = require('dotenv')

const mongoose = require('mongoose')
const cors = require('cors')
const TodoModel = require("./models/todoList")


dotenv.config();
var app = express();
app.use(cors({
    origin:'https://lucent-kelpie-112227.netlify.app/',
}
    
));
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Connect to your MongoDB database (replace with your database URL)
mongoose.connect(process.env.DB_Connect);

// Check for database connection errors
mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

// Get saved tasks from the database
app.get("/getTodoList", (req, res) => {
    TodoModel.find({})
        .then((todoList) => res.json(todoList))
        .catch((err) => res.json(err))
});

// Add new task to the database
app.post("/addTodoList", (req, res) => {
    TodoModel.create({
        task: req.body.task,
        description: req.body.description,
        status: req.body.status,
        deadline: req.body.deadline, 
    })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

// Update task fields (including deadline)
app.post("/updateTodoList/:id", (req, res) => {
    const id = req.params.id;
    const updateData = {
        task: req.body.task,
        description: req.body.description,
        status: req.body.status,
        deadline: req.body.deadline, 
    };
    TodoModel.findByIdAndUpdate(id, updateData)
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

// Delete task from the database
app.delete("/deleteTodoList/:id", (req, res) => {
    const id = req.params.id;
    TodoModel.findByIdAndDelete({ _id: id })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

app.listen(PORT, ()=> {
    console.log('Server running on 5000');
});
