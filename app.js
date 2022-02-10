const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// Database
const uri =  process.env.DB_PATH
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//MiddleWare
app.use(cors());
app.use(express.json());



async function run() {
    try {
        await client.connect();
        console.log('database connected')

        const database = client.db("yoodahostel");

        // collection
        const foodCollection = database.collection("food")
        const studentCollection = database.collection('students');
        const distributionCollection = database.collection('distributed')



        //Routes
        app.get('/', (req, res) => res.send('Yooda Hostel API'))

        // get all food
        app.get('/allFood', async (req, res) => {
            const result = await foodCollection.find({}).toArray();
            res.json(result);
        });

        // get all students
        app.get('/allStudent', async (req, res) => {
            const result = await studentCollection.find({}).toArray();
            res.json(result);
        });
        // get all distribution list
        app.get('/distributed', async (req, res) => {
            const result = await distributionCollection.find({}).toArray();
            res.json(result);
        });

        // get single food
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.findOne(query);
            res.json(result);
        });

        // get single student
        app.get('/student/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.findOne(query);
            res.json(result);
        });

        // get student for serve
        app.get('/distribution/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.findOne(query);
            res.json(result);
        });

        // add food 
        app.post('/addFood', async (req, res) => {
            const addFood = req.body;
            const result = await foodCollection.insertOne(addFood);
            res.json(result);
        });

        // add student 
        app.post('/addStudent', async (req, res) => {
            const addStudent = req.body;
            const result = await studentCollection.insertOne(addStudent);
            res.json(result);
        });

        // add distribution
        app.post('/distributed', async (req, res) => {
            const distribution = req.body;
            const result = await distributionCollection.insertOne(distribution);
            res.json(result);
        });

        // DELETE FOOD 
        app.delete('/foodDelete/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            res.json(result)

        });

        // DELETE Student
        app.delete('/studentDelete/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.deleteOne(query);
            res.json(result)

        });

        // UPDATE FOOD
        app.put('/food/:id', async (req, res) => {
            const id = req.params.id;
            const updatedFood = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedFood.name,
                    price: updatedFood.price
                },
            };
            const result = await foodCollection.updateOne(filter, updatedDoc, options)
            res.json(result)
        });

        // UPDATE Student
        app.put('/student/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStudent = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    fullName: updatedStudent.fullName,
                    roll: updatedStudent.roll,
                    age: updatedStudent.age,
                    class: updatedStudent.class,
                    hall: updatedStudent.hall,
                    status: updatedStudent.status,
                },
            };
            const result = await studentCollection.updateOne(filter, updatedDoc, options)
            res.json(result)
        });

        // update status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateStatus = {
                $set: {
                    status: 'ACTIVE'
                },
            };

            const result = await studentCollection.updateOne(filter, updateStatus, options);
            res.send(result);
        });


    }
    finally {

    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`Listening at ${port}`)
})