const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("task", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        title: {
            type: Sequelize.STRING
        },
        category: {
            type: Sequelize.STRING
        },
        comments: {
            type: DataTypes.JSON,
        }
    });
    return Task;
};