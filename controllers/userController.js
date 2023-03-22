require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Token = require('../models/token.js');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require('crypto');

const TOKEN_EXPIRY = "7d";
const EMAIL_EXPIRY = Date.now() + 15 * 60 * 1000;
const STATUS_SUCCESS = "success";
const STATUS_FAILED = "failed";
const BCRYPT_SALT = 10


class UserController {


    static getAllUsers = async (req, res) => {
        try {
            const listOfAllUsers = await User.find({});
            if (!listOfAllUsers || listOfAllUsers.length == 0) {
                return res.send({status: 400, message: "No users found!"});
            }
            res.status(200).send({ status: 200, message: "All users fetched successfully!", data: listOfAllUsers});
        } catch (error) {
            console.log(error);
            res.status(400).send({ status: 400,message: `Something went wrong! ${error}`});
        }
    }


    static userRegistration = async (req, res) => {
        const {name, email, password, phone, isAdmin, role, organization, createdAt, faceEmbeddings, profileAvatar} = req.body;

        try {
          const existingUser = await User.findOne({email: email})
          if (existingUser) {
            return res.status(400).json({ status: 400, message: "Email already exists!" });
          }

          if (!name || !email || !password || !phone || !role || !organization || !createdAt || !faceEmbeddings) {
            return res.status(400).send({ status: 400, message: "All fields are required!"});
          }

          const salt = await bcrypt.genSalt(BCRYPT_SALT)
            const hashedPassword = await bcrypt.hash(password, salt)
            const doc = new User({
                name,
                email,
                password: hashedPassword,
                phone,
                isAdmin,
                role,
                organization,
                createdAt,
                faceEmbeddings,
                profileAvatar
            })

            await doc.save()
            const saved_user = await User.findOne({email: email})
            const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: TOKEN_EXPIRY})
            res.status(200).send({ status: 200, message: "User registered successfully!", "token": token});

        } catch (error) {
          console.log(error);
          res.status(400).send({ status: 400, message: `Something went wrong! ${error}`});
        }  
    }


    static userLogin = async (req, res) => {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            return res.status(400).send({ status: 400, message: "All fields are required!"});
          }

          const user = await User.findOne({ email: email });
          if (!user) {
            return res.status(404).send({ status: 404, message: "You're not a registered user!"});
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).send({ status: 400, message: "Invalid email or password!"});
          }

          const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
          res.status(200).send({ status: 200, message: "User logged in successfully!", token: token});
            
        } catch (error) {
            console.log(error);
            res.status(400).send({ status: 400, message: "Unable to login!"});
        }
    }


    static deleteUser = async (req, res) => {
      try {
        const userExists = await User.findById(req.params.id);
        if (!userExists) {
          return res.status(404).send({ status: 404, message: "User not found!"});
        }

        await userExists.deleteOne();
        res.status(200).send({ status: 200, message: "User deleted successfully!" })
      } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error });
      }
    }


    static getUserById = async (req, res) => {
      try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).send({ status: 404, message: "User not found!"});
        }
        res.status(200).send({ status: 200, message: "User found successfully!", user: user });
      } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
          return res.status(400).send({ status: 400, message: `Invalid ${error.path}: ${error.value}` });
        }
        res.status(500).send({ status: 500, message: "Something went wrong!" });
      }
    }



    static resetPassword = async (req, res) => {
      try {
        const email = req.body.email;
        if (!email) {
          return res.status(400).send({ status: 400, message: "Email is required!" });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(400).send({ status: 400, message: "You're not a registered user!"});
        }

        let token = await Token.findOne({ userId: user._id });
         if (!token) {
              token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
                expiresAt: EMAIL_EXPIRY
              }).save();
          }

          const link = `http://localhost:${process.env.PORT}/reset-password/${user._id}/${token.token}`;
          const emailMessage = generatePasswordResetEmail(user.name, link);

          await sendEmail(user.email, "Password reset", emailMessage);
          res.status(200).send({ status: 200, message: "Email sent successfully!"})

      } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error });
      }
    }
    

    static resetPasswordFromLink = async (req, res) => {
      try {
        const user = await User.findById(req.params.userId);
        if (!user) {
          return res.status(400).send({ status: 400, message: "You're not a registered user!"});
        }

        const token = await Token.findOne({userId: user._id,token: req.params.token});
        if (!token) {
          return res.status(400).send({ status: 400, message: "Invalid link or expired link!"})
        }

        const salt = await bcrypt.genSalt(BCRYPT_SALT)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        user.password = hashedPassword;

        await user.save();
        await token.deleteOne();
        res.status(200).send({ status: 200, message: "Password changed successfully!" })

      } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error });
      }
    }


  
};

function generatePasswordResetEmail(name, resetLink) {
  const supportEmail = process.env.USER;
  const emailContent = `Hi ${name},

You requested a password reset. To proceed, click the link below within 15 minutes:

${resetLink}

If you didn't request a password reset, please ignore this email.

Got questions or concerns? Contact us anytime at ${supportEmail}. We're always happy to help.

Best regards,
PresIN Team`;
  return emailContent.trim();
}

module.exports = UserController;