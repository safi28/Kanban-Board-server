const { fetchID } = require("../fetchId");
const db = require("../models");
const Task = db.tasks;
const Op = db.Sequelize.Op;

// Create and Save a new Task
exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const task = {
        id: fetchID(),
        category: req.body.category,
        title: req.body.title,
        comments: req.body.comments,
    };

    Task.create(task)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Task."
            });
        });
};

exports.addComment = (req, res) => {
    const { userId, comment, id } = req.body;
    Task.findByPk(id)
        .then(data => {
            if (data) {
                data.update({
                    comments: {
                        name: userId,
                        text: comment,
                        id: fetchID(),
                    }
                }).then((result) => {
                    res.send(result);
                });
            } else {
                res.status(404).send({
                    message: `Cannot find Task with id=${id}.`
                });
            }
        })
}

exports.findComments = (req, res) => {
    Task.findAll({ attributes: ['comments'] }).then((data) => {
        res.send(data)
    })
}

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Task.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tasks."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Task.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Task with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Task with id=" + id
            });
        });
};

exports.update = (req, res) => { };

exports.delete = (req, res) => { };

exports.deleteAll = (req, res) => { };

exports.findAllPublished = (req, res) => { };