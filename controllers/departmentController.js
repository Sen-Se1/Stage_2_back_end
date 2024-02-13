const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");

const Department = require('../models/departmentModel');

// @desc    Create specific department
// @route   POST /department
// @access  Private
exports.createDepartment = asyncHandler(async (req, res, next) => {
    const department = await Department.create({
        codeD: req.body.codeD.toUpperCase(),
        libelle: req.body.libelle.toUpperCase(),
    });
    res.status(201).json({ data: department });

});

// @desc    Get list of department
// @route   GET /department
// @access  Private
exports.getAllDepartment = asyncHandler(async (req, res, next) => {
    // Build and Execute query
    const departmentCount = await Department.countDocuments();
    const departments = await Department.find();
    res.status(200).json({ result: departmentCount, data: departments });
});

// @desc    Get specific department
// @route   GET /department/:id
// @access  Private
exports.getByIdDepartment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build and Execute query
    const department = await Department.findOne({ _id: id });

    if (!department) {
        return next(new ApiError(`No department for this id : ${id}`, 404));
    }
    res.status(200).json({ data: department });
});

// @desc    Update specific department
// @route   PUT /department/:id
// @access  Private
exports.updateDepartment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const newData = {
        codeD: req.body.codeD.toUpperCase(),
        libelle: req.body.libelle.toUpperCase(),
    };
    // Build query
    const department = await Department.findOneAndUpdate({ _id: id }, newData, { new: true });

    if (!department) {
        return next(new ApiError(`No department for this this id : ${id}`, 404));
    }

    res.status(200).json({ data: department });
});

// @desc    Delete specific department
// @route   DELETE /department/:id
// @access  Private
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build query
    const department = await Department.findOneAndDelete({ _id: id });

    if (!department) {
        return next(new ApiError(`No department for this this id : ${id}`, 404));
    }

    res.status(204).send();
});