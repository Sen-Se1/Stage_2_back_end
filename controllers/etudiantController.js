const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");

const Etudiant = require('../models/etudiantModel');

// @desc    Create specific etudiant
// @route   POST /etudiant
// @access  private
exports.createEtudiant = asyncHandler(async (req, res, next) => {
    const etudiant = await Etudiant.create({
        cin: req.body.cin,
        nom: req.body.nom.toUpperCase(),
        prenom: req.body.prenom.toUpperCase(),
        email: req.body.email,
        tel: req.body.tel,
        codeG: req.body.codeG.toUpperCase(),
    });
    res.status(201).json({ data: etudiant });
});

// @desc    Create specific etudiant by file
// @route   POST /etudiant/file
// @access  private
exports.createByFileEtudiant = asyncHandler(async (req, res, next) => {
    const etudiant = await Etudiant.create({
        cin: req.body.cin,
        nom: req.body.nom.toUpperCase(),
        prenom: req.body.prenom.toUpperCase(),
        email: req.body.email,
        tel: req.body.tel,
        codeG: req.body.codeG.toUpperCase(),
    });
    res.status(201).json({ data: etudiant });
});

// @desc    Get list of etudiant
// @route   GET /etudiant
// @access  Private
exports.getAllEtudiant = asyncHandler(async (req, res, next) => {
    // Build and Execute query
    const etudiantCount = await Etudiant.countDocuments();
    const etudiant = await Etudiant.find().populate('codeG','codeG libelle');
    res.status(200).json({ result: etudiantCount, data: etudiant });
});

// @desc    Get specific etudiant
// @route   GET /etudiant/:id
// @access  Private
exports.getByIdEtudiant = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build and Execute query
    const etudiant = await Etudiant.findOne({ _id: id }).populate('codeG','codeG libelle');

    if (!etudiant) {
        return next(new ApiError(`No student for this id : ${id}`, 404));
    }
    res.status(200).json({ data: etudiant });
});

// @desc    Update specific etudiant
// @route   PUT /etudiant/:id
// @access  Private
exports.updateEtudiant = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const newData = {
        cin: req.body.cin,
        nom: req.body.nom.toUpperCase(),
        prenom: req.body.prenom.toUpperCase(),
        email: req.body.email,
        tel: req.body.tel,
        codeG: req.body.codeG.toUpperCase(),
    };
    // Build query
    const etudiant = await Etudiant.findOneAndUpdate({ _id: id }, newData, { new: true });

    if (!etudiant) {
        return next(new ApiError(`No student for this this id : ${id}`, 404));
    }

    res.status(200).json({ data: etudiant });
});

// @desc    Delete specific etudiant
// @route   DELETE /etudiant/:id
// @access  Private
exports.deleteEtudiant = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build query
    const etudiant = await Etudiant.findOneAndDelete({ _id: id });

    if (!etudiant) {
        return next(new ApiError(`No student for this this id : ${id}`, 404));
    }

    res.status(204).send();
});