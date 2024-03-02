const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");

const Affectation = require('../models/affectationModel');

// @desc    Create specific affectation
// @route   POST /affectation
// @access  private
exports.createAffectation = asyncHandler(async (req, res, next) => {
    const affectation = await Affectation.create({
        cin: req.body.cin,
        codeS: req.body.codeS,
        lieuS: req.body.lieuS.toUpperCase(),
        codeRap: req.body.codeRap.toUpperCase(),
        dateD: req.body.dateD,
        dateF: req.body.dateF,
    });
    res.status(201).json({ data: affectation });
});

// @desc    Get list of affectation
// @route   GET /affectation
// @access  Private
exports.getAllAffectation = asyncHandler(async (req, res, next) => {
    // Build and Execute query
    const affectationCount = await Affectation.countDocuments();
    const affectations = await Affectation.find().populate('cin', 'cin nom prenom').populate('codeS', 'codeS');
    res.status(200).json({ result: affectationCount, data: affectations });
});

// @desc    Get specific affectation
// @route   GET /affectation/:id
// @access  Private
exports.getByIdAffectation = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build and Execute query
    const affectation = await Affectation.findOne({ _id: id }).populate('cin', 'cin').populate('codeS', 'codeS');

    if (!affectation) {
        return next(new ApiError(`Aucune affectation pour cet identifiant : ${id}`, 404));
    }
    res.status(200).json({ data: affectation });
});

// @desc    Update specific affectation
// @route   PUT /affectation/:id
// @access  Private
exports.updateAffectation = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const newData = {
        cin: req.body.cin,
        codeS: req.body.codeS,
        lieuS: req.body.lieuS.toUpperCase(),
        codeRap: req.body.codeRap.toUpperCase(),
        dateD: req.body.dateD,
        dateF: req.body.dateF,
    };
    // Build query
    const affectation = await Affectation.findOneAndUpdate({ _id: id }, newData, { new: true });

    if (!affectation) {
        return next(new ApiError(`Aucune affectation pour cet identifiant : ${id}`, 404));
    }

    res.status(200).json({ data: affectation });
});

// @desc    Delete specific affectation
// @route   DELETE /affectation/:id
// @access  Private
exports.deleteAffectation = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build query
    const affectation = await Affectation.findOneAndDelete({ _id: id });

    if (!affectation) {
        return next(new ApiError(`Aucune affectation pour cet identifiant : ${id}`, 404));
    }

    res.status(204).send();
});