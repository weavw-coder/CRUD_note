const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Importing the Models
const Note = require('./note');
const Message = require('./message');

// URL of the database hosted on MongoDB Atlas
const dbURL = 'mongodb+srv://sayancoolmajhi:u9VKlU2DyCu8rIfM@cluster0.s9bpmg6.mongodb.net/?retryWrites=true&w=majority'

// Connecting to the database and running the server on port 3000
mongoose.connect(dbURL,{useNewUrlParser:true, useUnifiedTopology:true})
.then(result => app.listen(process.env.PORT || 3640,()=>{
    console.log('server running on 3640')
}))
.catch(err => console.log('error'));

app.set('view engine', 'ejs'); // Setting the View Engine

// Middlewares
app.use(express.static('views')); // Setting the Static Folder
app.use(express.urlencoded({ extended: true })); // Middleware for URL

// Home Page Route
app.get('/', (req, res) => {
    // Getting all notes from the database
    Note.find()
        .then(result => res.render('home', { title: 'Home', notes: result }))
        .catch(err => console.log(err));
});

// About Page Route
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// Contact Page Route
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

// Submitting messages through Contact Form
app.post('/contact', (req, res) => {
    // Creating a new instance of the Message Model and inserting the values from Request URL
    const message = new Message(req.body);
    // Saving the message to the database
    message.save()
        .then(result => res.redirect('/'))
        .catch(err => res.status(404).render('error', { title: 'Error' }));
});

// Create Page Route
app.get('/add', (req, res) => {
    res.render('add', { title: 'Add' });
});

// Creating new notes
app.post('/add', (req, res) => {
    // Creating a new instance of the Note Model and inserting the values from Request URL
    const note = new Note(req.body);
    // Saving the note to the database
    note.save()
        .then(result => res.redirect('/'))
        .catch(err => res.status(404).render('error', { title: 'Error' }));
});

// Edit Page Route
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    Note.findById(id)
        .then(result => res.render('edit', { title: 'Edit', note: result }))
        .catch(err => res.status(404).render('error', { title: 'Error' }));
});

// Updating a note by its ID
app.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    Note.findByIdAndUpdate(id, req.body)
        .then(result => res.redirect('/'))
        .catch(err => res.status(404).render('error', { title: 'Error' }));
});

// Deleting a note by its ID
app.get('/:id', (req, res) => {
    const id = req.params.id;
    Note.findByIdAndDelete(id)
        .then(result => res.redirect('/'))
        .catch(err => res.status(404).render('error', { title: 'Error' }));
});

// Error Page
app.use((req, res) => {
    res.status(404).render('error', { title: 'Error' });
})

// // Static Array for contents
// const notes = [
//     {
//         title: 'Web Dev Class',
//         body: 'Learning how to store data in MongoDB and render them on the fontend.'
//     },
//     {
//         title: 'Repairing Laptop',
//         body: 'Installing SSD and downloading fresh copy of Windows 10.'
//     },
//     {
//         title: 'Grocery',
//         body: 'Buying necessary items for home like Milk and Meat.'
//     }
// ];