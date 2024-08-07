const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { createError, successMessage } = require("../utils/ResponseMessage"); // Adjust the path to where your utils file is located
const Portfolio = require("../Models/Portfolio");

// Create a new portfolio entry
router.post("/", async (req, res) => {
  try {
    const portfolio = new Portfolio(req.body);
    await portfolio.save();
    return successMessage(res, portfolio, "Portfolio created successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
});

// Read all portfolio entries
router.get("/", async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    return successMessage(res, portfolios, "Portfolios fetched successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
});

// Read a single portfolio entry by ID
router.get("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return createError(res, 404, "Portfolio not found");
    }
    return successMessage(res, portfolio, "Portfolio fetched successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
});

// Update a portfolio entry by ID
router.put("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!portfolio) {
      return createError(res, 404, "Portfolio not found");
    }
    return successMessage(res, portfolio, "Portfolio updated successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
});

// Delete a portfolio entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) {
      return createError(res, 404, "Portfolio not found");
    }
    return successMessage(res, portfolio, "Portfolio deleted successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
});

module.exports = router;
