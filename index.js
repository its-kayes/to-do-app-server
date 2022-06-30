const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors');

require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dto4t.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        let taskCollectiondb = client.db("todo").collection("task");
        app.post('/tasks', async (req, res) => {
            let task = req.body;
            let result = await taskCollectiondb.insertOne(task);
            res.send(result);
        });
        app.get('/tasks', async (req, res) => {
            let user = await taskCollectiondb.find().toArray();
            res.send(user);
            console.log(user);
        });

        app.delete('/tasks/:id', async (req, res) => {
            let id = req.params.id;
            let query = { _id: ObjectId(id) };
            let task = await taskCollectiondb.deleteOne(query);
            res.send(task);
        });
        app.put('/todo/:id', async (req, res) => {
            let id = req.params.id;
            let todo = req.body;
            console.log(todo);
            let updateTodo = {
                $set: {
                    name: todo.name,
                    description: todo.description
                }
            }
            let query = { _id: ObjectId(id) };
            let options = { upsert: true };
            let result = await taskCollectiondb.updateOne(query, updateTodo, options);
            res.send(result);
        })
    }

    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Task Are Ready!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})