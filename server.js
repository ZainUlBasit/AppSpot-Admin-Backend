const express = require("express");
const cors = require("cors");
// const {ConnectionOptions} = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");

// Routes
const portfolioRoutes = require("./routes/portfolio.routes"); // Adjust the path according to your file structure
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT;
const SOCKET_SECRET_KEY = process.env.SOCKET_SECRET_KEY;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.mongooseUrl, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   // res.header('Access-Control-Allow-Origin', "*");
//   // res.header('Access-Control-Allow-Credentials', true);
//   // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   const app_secret = req?.headers["app_secret"];
//   const token = req.query?.token;
//   console.log("app_secret : ", app_secret);
//   if (token != PAYPAL_TOKEN && app_secret != APP_ID)
//     return createError(res, 401, "App is Unauthorized!");
//   // const app_id = jwt.verify(app_secret, PRIVATE_KEY)
//   // CODE SHOULD BE CONTINUED : ONLY APP_ID IS LEFT AND THEN JWT TOKEN CREATION IS TO BE DONE
//   next();
// });
// we should have cors object specified here,

app.use(function (req, res, next) {
  console.log(req.originalUrl);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// socket io functionalities;

const io = new Server(server, { cors: { origin: true } }); // socket io server!
// const io = require("socket.io").
app.io = io;
app.set("io", io);
global.io = io;

function socketEmit(socket, event, data) {
  socket.emit(event, data);
}
io.on("connection", (socket) => {
  console.log("connection established!");
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
        console.log("no other then company room joined!");
        socket.join(`/visitor`);
        break;
    }
  } catch (error) {
    console.log("SOCKET ERROR");
    console.log(error);
  }
});

app.use("/api/portfolio", portfolioRoutes);

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
