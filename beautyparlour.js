const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3001;

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'beautyParlorDB';

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static('public'));

// GET request handler for the registration form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/beautyparlour.html');
});

// POST request handler for form submission
app.post('/register', (req, res) => {
    const { name, email, phone, service, date } = req.body;
    // Connect to MongoDB and insert the registration data
    MongoClient.connect(uri, { useUnifiedTopology: true })
        .then(client => {
            const db = client.db(dbName);
            const collection = db.collection('registrations');
            return collection.insertOne({ name, email, phone, service, date });
        })
        .then(result => {
            console.log('Registration data inserted successfully:', result.ops);
            res.send('Registration successful!');
        })
        .catch(err => {
            console.error('Error connecting to MongoDB or inserting document:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
