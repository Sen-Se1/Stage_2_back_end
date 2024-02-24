const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
// const Etudiant = require('../models/etudiantModel');

const Groupe = require("../models/groupeModel");

// @desc    Create specific stage
// @route   POST /groupe
// @access  private
exports.createGroupe = asyncHandler(async (req, res, next) => {
    const groupe = await Groupe.create({
        codeG: req.body.codeG.toUpperCase(),
        libelle: req.body.libelle.toUpperCase(),
        codeD: req.body.codeD.toUpperCase(),
    });
    res.status(201).json({ data: groupe });
});

// @desc    Get list of groupe
// @route   GET /groupe
// @access  private
exports.getAllGroupe = asyncHandler(async (req, res, next) => {
    // Build and Execute query
    const groupeCount = await Groupe.countDocuments();
    const groupes = await Groupe.find().populate('codeD', 'codeD libelle');
    res.status(200).json({ result: groupeCount, data: groupes });
});

// @desc    Get specific groupe
// @route   GET /groupe/:id
// @access  private
exports.getByIdGroupe = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build and Execute query
    const groupe = await Groupe.findOne({ _id: id }).populate('codeD', 'codeD libelle');

    if (!groupe) {
        return next(new ApiError(`Aucun groupe pour cet identifiant : ${id}`, 404));
    }
    res.status(200).json({ data: groupe });
});

// @desc    Update specific groupe
// @route   PUT /groupe/:id
// @access  private
exports.updateGroupe = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const newData = {
        codeG: req.body.codeG.toUpperCase(),
        libelle: req.body.libelle.toUpperCase(),
        codeD: req.body.codeD.toUpperCase(),
    };
    // Build query
    const groupe = await Groupe.findOneAndUpdate({ _id: id }, newData, { new: true });

    if (!groupe) {
        return next(new ApiError(`Aucun groupe pour cet identifiant : ${id}`, 404));
    }

    res.status(200).json({ data: groupe });
});

// @desc    Delete specific groupe
// @route   DELETE /groupe/:id
// @access  private
exports.deleteGroupe = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build query
    const groupe = await Groupe.findOneAndDelete({ _id: id });

    if (!groupe) {
        return next(new ApiError(`Aucun groupe pour cet identifiant : ${id}`, 404));
    }
    
    res.status(204).send();
});
