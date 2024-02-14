import express,{json} from "express";
import mongoose from "mongoose";
import User from "./models/UserModel.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import driverModel from "./Models/driverModel.js";

dotenv.config();
const app = express();
const PORT = 3000;


app.listen(PORT, () => {
    console.log("Listening on PORT:" + PORT);
});

app.use(cors());
app.use(json());
//Connect to mongodb
mongoose.connect(process.env.DATABASE_URL).then(() => {console.log("Database connected successfully");});


const generateToken = (user_id) => {
    const token = jwt.sign({user_id,}, process.env.SECRET_KEY, { expiresIn: "1d" });
    return token;
};

const checkToken = (req, res, next) => {
    let token = req.headers.authorization;
    // token present or not
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
    // check validity of the token
    try {
      token = token.split(" ")[1];
  
      let decodedToken = jwt.verify(token, "secret");
  
      req.user_id = decodedToken.user_id;
  
      next();
    } catch {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
};

//Create a new user
app.post("/register", (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
  
    if (!name || !username || !password) {
      return res.status(400).json({
        message: "Please fill all fields!",
      });
    }
  
    User.findOne({username: username,}).then((data, err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
  
      if (data) {
        return res.status(409).json({
          message: "Username already used",
        });
      } else {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);
  
        User.create({
          name: name,
          username: username,
          password: encryptedPassword,
        }).then((data, err) => {
          if (err) {
            return res.status(500).json({
              message: "Internal Server Error",
            });
          }
  
          return res.status(201).json({
            message: "User registered successfully!",
            user: data,
            token: generateToken(data._id),
          });
        });
      }
    });
  });

//Login a user
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Please fill all fields!",
        });
    }
    User.findOne({
        username: username,
      }).then((data, err) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
    
        if (data) {
          const isMatch = bcrypt.compareSync(password, data.password);
    
          if (isMatch) {
            return res.status(200).json({
              message: "User validated successfully!",
              user: data,
              token: generateToken(data._id),
            });
          } else {
            return res.status(401).json({
              message: "Invalid Credentials",
            });
          }
        } else {
          return res.status(404).json({
            message: "User not found!",
          });
        }
    });
});

//Create a new trip for passengername
app.post("/createTrip",checkToken, (req, res) => {
    const passengerName = req.body.PassengerName;
    const tripId = req.body.tripId;
    const driverName = req.body.driverName;
    const driverPhone = req.body.driverPhone;
    const cabNumber = req.body.cabNumber;
  
    if (!passengerName || !driverName || !driverPhone || !cabNumber || !tripId) {
      return res.status(400).json({
        message: "Please fill all fields!",
      });
    }
  
    driverModel.create({
      PassengerName: passengerName,
      driverName: driverName,
      driverPhone: driverPhone,
      cabNumber: cabNumber,
      tripId: tripId,
    }).then((data, err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
  
      return res.status(201).json({
        message: "Trip created successfully!",
        trip: data,
      });
    });
  });

//get a trip by username
app.get("/getTrip/:tripId", (req, res) => {
    const tripId = req.params.tripId;
  
    if (!tripId) {
      return res.status(400).json({
        message: "Please fill all fields!",
      });
    }
  
    driverModel.findOne({ PassengerName: tripId, }).then((data, err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
  
      if (data) {
        return res.status(200).json({
          message: "Trip found successfully!",
          trip: data,
        });
      } else {
        return res.status(404).json({
          message: "Trip not found!",
        });
      }
    });
});

//add a review using patch
app.patch("/addReview/:tripId", (req, res) => {
    const tripId = req.params.tripId;
    const review = req.body.review;
  
    if (!tripId || !review) {
      return res.status(400).json({
        message: "Please fill all fields!",
      });
    }
  
    driverModel.findOneAndUpdate(
      { tripId: tripId, },
      { review: review, },
      { new: true, }
    ).then((data, err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
  
      if (data) {
        return res.status(200).json({
          message: "Review added successfully!",
          trip: data,
        });
      } else {
        return res.status(404).json({
          message: "Trip not found!",
        });
      }
    });
});

//get user
app.get("/getUser",checkToken, (req, res) => {
    User.findOne({ _id: req.user_id, }).then((data, err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
  
      if (data) {
        return res.status(200).json({
          message: "User found successfully!",
          user: data.username,
        });
      } else {
        return res.status(404).json({
          message: "User not found!",
        });
      }
    });
});

  //get all trips
app.get("/getAllTrips",checkToken, (req, res) => {
    driverModel.find().then((data, err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
  
      if (data) {
        return res.status(200).json({
          message: "Trips found successfully!",
          trips: data,
        });
      } else {
        return res.status(404).json({
          message: "Trips not found!",
        });
      }
    });
  });