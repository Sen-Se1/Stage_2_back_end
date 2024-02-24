const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");

const Stage = require('../models/stageModel');

// @desc    Create specific stage
// @route   POST /stage
// @access  Private
exports.createStage = asyncHandler(async (req, res, next) => {
    const stage = await Stage.create({
        codeS: req.body.codeS.toUpperCase(),
        type: req.body.type.toUpperCase(),
        duree: req.body.duree
    });
    res.status(201).json({ data: stage });

});

// @desc    Get list of stage
// @route   GET /stage
// @access  Private
exports.getAllStage = asyncHandler(async (req, res, next) => {
    // Build and Execute query
    const stageCount = await Stage.countDocuments();
    const stages = await Stage.find();
    res.status(200).json({ result: stageCount, data: stages });
});

// @desc    Get specific stage
// @route   GET /stage/:id
// @access  Private
exports.getByIdStage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build and Execute query
    const stage = await Stage.findOne({ _id: id });

    if (!stage) {
        return next(new ApiError(`Aucune stage pour cet identifiant : ${id}`, 404));
    }
    res.status(200).json({ data: stage });
});

// @desc    Update specific stage
// @route   PUT /stage/:id
// @access  Private
exports.updateStage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const newData = {
        codeS: req.body.codeS.toUpperCase(),
        type: req.body.type.toUpperCase(),
        duree: req.body.duree
    };
    // Build query
    const stage = await Stage.findOneAndUpdate({ _id: id }, newData, { new: true });

    if (!stage) {
        return next(new ApiError(`Aucune stage pour cet identifiant : ${id}`, 404));
    }

    res.status(200).json({ data: stage });
});

// @desc    Delete specific stage
// @route   DELETE /stage/:id
// @access  Private
exports.deleteStage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build query
    const stage = await Stage.findOneAndDelete({ _id: id });

    if (!stage) {
        return next(new ApiError(`Aucune stage pour cet identifiant : ${id}`, 404));
    }

    res.status(204).send();
});