const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EmailName,
    pass: process.env.EmailPass,
  },
});

// Set up handlebars as the template engine
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve("./views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views/"),
  extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

// async function to send email
const sendMail = async (email, sender_email, name, purpose, description) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: "AppSpot Solutions",
        address: process.env.EmailName,
      },
      to: email,
      subject: "Contact Us Form Submission ✔",
      template: "contact", // Use 'contact' as the template name (without extension)
      context: {
        name, // Pass the name variable
        email: sender_email, // Pass the email variable
        purpose, // Pass the purpose variable
        description, // Pass the description variable
      },
    });
    return true;
  } catch (error) {
    console.error("Error occurred while sending email: ", error);
    return false;
  }
};

module.exports = {
  sendMail,
};
