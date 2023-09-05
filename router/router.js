import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import myUser from "../db/user.js";
import myRoom from "../db/emptyroom.js";
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = pkg;
import pkg from 'agora-token';


const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});
const upload = multer({ storage });


router.get("/user", async (req, res) => {
  try {
    const user = await myUser.find();
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

router.post("/user", async (req, res) => {
  try {
    const theuser = req.body;
    const createduser = await myUser.create(theuser);
    res.status(201).json(createduser);
  } catch (error) {
    console.log(error);
  }
});
router.put("/user", async (req, res) => {
  try {
    const updatedUsers = req.body;

    // Loop through the updatedUsers array and update each user individually
    const updatedUsersPromises = updatedUsers.map(async (updatedUser) => {
      const { _id, name, password } =
        updatedUser;

      // Find the user by their unique identifier
      const user = await myUser.findById(_id);

      if (!user) {
        // Handle the case where the user is not found
        throw new Error(`User with ID ${_id} not found`);
      }

      // Update the user properties
      user.name = name;
      user.password = password;
     

      // Save the updated user in the database
      await user.save();

      return user;
    });

    // Wait for all users to be updated
    const updatedUsersResult = await Promise.all(updatedUsersPromises);

    res.json(updatedUsersResult);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const theuser = await myUser.findById(id);
    console.log("object");
    if (!theuser) {
      return;
    }
    res.status(200).json(theuser);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await myUser.findByIdAndRemove(id);
    res.json({ message: "User Silindi" });
  } catch (error) {
    console.log(error);
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("user bulunamadı");
    }
    const updatedUser = {
      name,
      password,
      _id: id,
    };
    await myUser.findByIdAndUpdate(id, updatedUser, { new: true });

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
  }
});
router.get("/room", async (req, res) => {
  try {
    const room = await myRoom.find();
    res.json(room);
  } catch (error) {
    console.log(error);
  }
});

router.post("/room", async (req, res) => {
  try {
    const theRoom = req.body;
    const createdRoom = await myRoom.create(theRoom);
    res.status(201).json(createdRoom);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/room", async (req, res) => {
  try {
    // Remove all rooms from the database
    await myRoom.deleteMany({});

    res.json({ message: "All rooms deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/room/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const theuser = await myUser.findById(id);
    console.log("object");
    if (!theuser) {
      return;
    }
    res.status(200).json(theuser);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/room/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await myRoom.findByIdAndRemove(id);
    res.json({ message: "Room Silindi" });
  } catch (error) {
    console.log(error);
  }
});


router.get("/token", async (req, res) => {
  try {

    // Rtc Examples
  const appId = 'acec74e5063744bfa5d5ac184d1fa4b3';
  const appCertificate = '3b3a886ab743415986372c10a2e7a8b8';
  const channelName = "a";
  const uid = "a"
  const userAccount = "a";
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600

  const currentTimestamp = Math.floor(Date.now() / 1000)

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

  // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

  // Build token with uid
  const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, "a", 0, role, privilegeExpiredTs);
  console.log("Token With Integer Number Uid: " + tokenA);

  // Build token with user account
  //const tokenB = RtcTokenBuilder.buildTokenWithAccount(appId, appCertificate, channelName, userAccount, role, privilegeExpiredTs);
  //console.log("Token With UserAccount: " + tokenB);

   // const createdRoom = await myRoom.create(theRoom);
    res.status(200).json(tokenA);
  } catch (error) {
    console.log(error);
  }
});


router.post("/token", async (req, res) => {
  try {
    const myToken = req.body;

    // Rtc Examples
  const appId = 'acec74e5063744bfa5d5ac184d1fa4b3';
  const appCertificate = '3b3a886ab743415986372c10a2e7a8b8';
  const channelName = myToken.channel;
  const uid = myToken.name;
  const userAccount = myToken.name;
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600

  const currentTimestamp = Math.floor(Date.now() / 1000)

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

  // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

  // Build token with uid
  const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, myToken.channel, myToken.name, role, privilegeExpiredTs);
  console.log("Token With Integer Number Uid: " + tokenA);

  // Build token with user account
  //const tokenB = RtcTokenBuilder.buildTokenWithAccount(appId, appCertificate, channelName, userAccount, role, privilegeExpiredTs);
  //console.log("Token With UserAccount: " + tokenB);

   // const createdRoom = await myRoom.create(theRoom);
    res.status(200).json(tokenA);
  } catch (error) {
    console.log(error);
  }
});

export default router;
