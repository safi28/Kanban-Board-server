const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const { tasks } = require('./tasks');
const { fetchID } = require('./fetchId');
const { TASK_DRAGGED, ADD_COMMENT, CREATE_TASK, FETCH_COMMENTS, TASKS, COMMENTS } = require('./CONSTANTS');

require('dotenv').config();

const socketIO = require('socket.io')(http, {
    cors: {
        origin: process.env.CLIENT_URL
    }
});

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = require("./models/index");
db.sequelize.sync({ force: false }) // force: false to not drop table if exists
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });


socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on(CREATE_TASK, (data) => {
        const newTAsk = { id: fetchID(), title: data.task, comments: [] }
        tasks['pending'].items.push(newTAsk)
        socket.emit(TASKS, tasks)
    });

    socket.on(ADD_COMMENT, (data) => {
        const { category, userId, comment, id } = data;
        const taskItems = tasks[category].items;
        taskItems.forEach((task) => {
            if (task.id === id) {
                task.comments.push({
                    name: userId,
                    text: comment,
                    id: fetchID(),
                });
                socket.emit(COMMENTS, task.comments)
            }
        })
    })

    socket.on(TASK_DRAGGED, (data) => {
        const { source, destination } = data;
        const itemMoved = {
            ...tasks[source.droppableId].items[source.index],
        };
        tasks[source.droppableId].items.splice(source.index, 1);
        tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);
        socket.emit(TASKS, tasks);
    });

    socket.on(FETCH_COMMENTS, (data) => {
        const { category, id } = data;
        const taskItems = tasks[category].items;
        taskItems.forEach((task) => {
            if (task.id === id) {
                socket.emit('comments', task.comments)
            }
        });
    })

    socket.on('disconnect', () => {
        socket.disconnect();
        console.log('🔥: A user disconnected');
    })
});

app.get("/api", (req, res) => {
    res.json(tasks);
});

require("./routes/task.routes.js")(app);

http.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`);
});
