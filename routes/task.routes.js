module.exports = app => {
    const tasks = require("../controllers/task.controller.js");

    var router = require("express").Router();

    // Create a new Task
    router.post("/", tasks.create);

    /// Add comment
    router.post("/comment", tasks.addComment);

    /// Get comments
    router.get('/comments', tasks.findComments)

    // Retrieve all Tasks
    router.get("/", tasks.findAll);

    // Retrieve all published Tasks
    router.get("/published", tasks.findAllPublished);

    // Retrieve a single Task with id
    router.get("/:id", tasks.findOne);

    // Update a Task with id
    router.put("/:id", tasks.update);

    // Delete a Task with id
    router.delete("/:id", tasks.delete);

    // Delete all Tasks
    router.delete("/", tasks.deleteAll);

    app.use('/api/tasks', router);
};