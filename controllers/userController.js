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
    static userRegistration = async (req, res) => {
        const {name, email, password, isAdmin, role, createdAt, embeddingsData} = req.body;

        try {
          const existingUser = await User.findOne({email: email})
          if (existingUser) {
            return res.status(400).json({ status: STATUS_FAILED, message: "Email already exists!" });
          }

          if (!name || !email || !password) {
            return res.send({status: STATUS_FAILED, message: "All fields are required!"});
          }

          const salt = await bcrypt.genSalt(BCRYPT_SALT)
            const hashedPassword = await bcrypt.hash(password, salt)
            const doc = new User({
                name,
                email,
                password: hashedPassword,
                isAdmin,
                role,
                createdAt,
                embeddingsData
            })

            await doc.save()
            const saved_user = await User.findOne({email: email})
            const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: TOKEN_EXPIRY})
            res.send({status: STATUS_SUCCESS, message: "User registered successfully!", "token": token});

        } catch (error) {
          console.log(error);
          res.send({ status: STATUS_FAILED, message: `Something went wrong! ${error}`});
        }  
    }


    static userLogin = async (req, res) => {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            return res.send({status: STATUS_FAILED, message: "All fields are required!"});
          }

          const user = await User.findOne({ email: email });
          if (!user) {
            return res.send({status: STATUS_FAILED, message: "You're not a registered user!"});
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.send({status: STATUS_FAILED, message: "Invalid email or password!"});
          }

          const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
          res.send({status: STATUS_SUCCESS, message: "User logged in successfully!", token: token});
            
        } catch (error) {
            console.log(error);
            return res.send({"status": STATUS_FAILED, message: "Unable to login!"});
        }
    }


    static resetPassword = async (req, res) => {
      try {
        const email = req.body.email;
        if (!email) {
          return res.status(400).send({ status: STATUS_FAILED, message: "Email is required!" });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
          return res.statud(400).send({ status: STATUS_FAILED, message: "You're not a registered user!"});
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

          return res.send({ status: STATUS_SUCCESS, message: "Email sent successfully!"})
      } catch (error) {
        console.log(error);
        return res.status(400).send({ status: STATUS_FAILED, message: error });
      }
    }
    

    static resetPasswordFromLink = async (req, res) => {
      try {
        const user = await User.findById(req.params.userId);
        if (!user) {
          return res.status(400).send({ status: STATUS_FAILED, message: "You're not a registered user!"});
        }

        const token = await Token.findOne({userId: user._id,token: req.params.token});
        if (!token) {
          return res.status(400).send({ status: STATUS_FAILED, message: "Invalid link or expired link!"})
        }


        const salt = await bcrypt.genSalt(BCRYPT_SALT)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        user.password = hashedPassword;
        await user.save();
        await token.deleteOne();

        res.send({ status: STATUS_SUCCESS, message: "Password changed successfully!" })
      } catch (error) {
        console.log(error);
        return res.status(400).send({ status: STATUS_FAILED, message: error });
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