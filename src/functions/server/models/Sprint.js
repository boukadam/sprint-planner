const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
    sprintId: String,
    sprintName: String,
    votingSystem: String
});

const Sprint = mongoose.model('Sprint', sprintSchema);

module.exports = Sprint;