const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 9090;

const mockUser = [
  {
    email: "farhan@girach.com",
    password: "123456",
    id: 1,
    username: "farhan",
  },
  {
    email: "farhan@girach2.com",
    password: "1234562",
    id: 12,
    username: "farhan2",
  },
  {
    email: "farhan@girach.com3",
    password: "1234563",
    id: 13,
    username: "farhan3",
  },
  {
    email: "farhan@girach.com4",
    password: "1234564",
    id: 14,
    username: "farhan4",
  },
  {
    email: "farhan@girach.com5",
    password: "1234565",
    id: 15,
    username: "farhan5",
  },
];
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  mockUser.filter((users) => {
    
    if (users.email === email) {
      if (users.password === password) {
        const payload = {
          id: users.id,
        };
        const token = jwt.sign(payload, "secret_key", { expiresIn: "1h" });
        return res.json({
          success: true,
          message: "Authentication successful!",
          token: token,
        });
      } else {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Authentication failed. Wrong password.",
        });
      }
    }
  });
});
const verifyTocken = (req, res, next) => {
  const bearerHeaders = req.headers["authorization"];
  if (typeof bearerHeaders !== "undefined") {
    const bearer = bearerHeaders.split(" ");
    const bearerTocken = bearer[1];
    req.token = bearerTocken;
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "No token provided." });
  }
};
app.post("/posts", verifyTocken, (req, res) => {
  jwt.verify(req.token, "secret_key", (err, authData) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    } else {
      res.json({
        success: true,
        message: "Posts fetched successfully.",
        authData: authData,
        data: [
            { id: 1, title: "Post 1", content: "This is post 1" },
            { id: 2, title: "Post 2", content: "This is post 2" },
            { id: 3, title: "Post 3", content: "This is post 3" },
          ],
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
