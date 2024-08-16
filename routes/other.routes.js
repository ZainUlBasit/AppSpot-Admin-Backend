const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { createError, successMessage } = require("../utils/ResponseMessage"); // Adjust the path to where your utils file is located
const { sendMail } = require("../utils/sendEmailUtil");

// Create a new portfolio entry
router.post("/send-email", async (req, res) => {
  try {
    const emailSend = await sendMail(
      req.body.reciever_email,
      req.body.sender_email,
      req.body.name,
      req.body.purpose,
      req.body.desc
    );
    return successMessage(res, emailSend, "Email sended successfully");
  } catch (error) {
    return createError(res, 400, error.message);
  }
});

module.exports = router;
