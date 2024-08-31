const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const { default: mongoose } = require("mongoose");

// Routes
const portfolioRoutes = require("./routes/portfolio.routes");
const otherRoutes = require("./routes/other.routes");

const PORT = process.env.PORT;
const SOCKET_SECRET_KEY = process.env.SOCKET_SECRET_KEY;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.mongooseUrl, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// CORS middleware configuration
app.use(
  cors({
    origin: "*", // Allow all URLs
    credentials: true,
  })
);

// Allow all CORS requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Socket.io functionalities
const io = new Server(server, { cors: { origin: "*" } }); // Allow all URLs for Socket.io
app.io = io;
app.set("io", io);
global.io = io;

io.on("connection", (socket) => {
  console.log("Connection established!");
  try {
    const { secretkey, token } = socket.handshake.headers;
    const { _doc: user } = jwt.verify(token, ACCESS_SECRET_KEY);
    console.log(secretkey);
    console.log(token);
    if (secretkey != SOCKET_SECRET_KEY || !token || !user)
      return socket.disconnect();

    switch (user.role) {
      case 1:
        console.log("===============Admin SOCKET JOINED==============");
        socket.join(["/admin-" + user._id]);
        break;
      case 2:
        console.log("===============Doctor SOCKET JOINED==============");
        socket.join(["/doctor-" + user.doctorId._id]);
        break;
      case 3:
        console.log("===============Patient SOCKET JOINED==============");
        socket.join(["/patient-" + user.patientId._id]);
        break;
      default:
        console.log("No other than company room joined!");
        socket.join(`/visitor`);
        break;
    }
  } catch (error) {
    console.log("SOCKET ERROR");
    console.log(error);
  }
});

app.use("/api/portfolio", portfolioRoutes);
app.use("/api", otherRoutes);

app.use("*", (req, res) => res.status(404).send("Not Found!"));
app.use((req, res, error) => {
  console.log(error);
  res.status(400).json({ success: false, error });
});

server.listen(PORT, async (error) => {
  if (error) return console.log("SERVER_CONNECTION ERROR", error);
  console.log("Server connected on ", PORT);
});

module.exports = {
  io: io,
};
