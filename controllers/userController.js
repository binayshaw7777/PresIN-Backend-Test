require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Token = require('../models/token.js');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require('crypto');


class UserController {
    static userRegistration = async (req, res) => {
        const {name, email, password, isAdmin, role, createdAt, embeddingsData} = req.body;
        const user = await User.findOne({email: email})
        if (user) {
          return res
            .status(400)
            .json({ status: "failed", message: "Email already exists!" });
        }
        if (name && email && password) {
            try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const doc = new User({
                name: name,
                email: email,
                password: hashedPassword,
                isAdmin: isAdmin,
                role: role,
                createdAt: createdAt,
                embeddingsData: embeddingsData
            })

            await doc.save()
            const saved_user = await User.findOne({email: email})
            const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})

            res.send({status: "success", message: "User registered successfully!", "token": token});

        } catch (error) {

          console.log(error);
          res.send({
            status: "failed",
            message: `Something went wrong! ${error}`,
          });
        }

        } else {
            res.send({status: "failed", message: "All fields are required!"});
        }
    }


    static userLogin = async (req, res) => {
        try {
            const {email, password} = req.body;
            if (email && password) {

                const user = await User.findOne({email: email})
                if (user != null) {

                    const isMatch = await bcrypt.compare(password, user.password)

                    if (isMatch && (user.email === email)) {

                        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})

                        res.send({status: "success", message: "User logged in successfully!", token: token})
                    } else {
                        return res.send({status: "failed", message: "Invalid email or password!"})
                    }
                    return res.send({status: "failed", message: `Something went wrong!`});
                } else {
                    return res.send({status: "failed", message: "You're not a registered user!"});
                }
            } else {
                return res.send({status: "failed", message: "All fields are required!"})
            }
        } catch (error) {
            console.log(error);
            return res.send({"status": "failed", "message": "Unable to login!"});
        }
    }


    static resetPassword = async (req, res) => {
      try {
        const email = req.body.email;
        if (email) {
          const user = await User.findOne({ email: email });
          if (user) {

            let token = await Token.findOne({ userId: user._id });
            if (!token) {
              token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
              }).save();
            }

            const link = `http://localhost:${process.env.PORT}/reset-password/${token.token}`;
            console.log(`Email is: ${email}`);
            const emailMessage = generatePasswordResetEmail(user.name, link);
            await sendEmail(user.email, "Password reset", emailMessage);
            console.log(`http://localhost:${process.env.PORT}/reset-password/${token.token}`)

            res.send({ status: "success", message: "Email sent successfully!" })

          } else {
            return res.send({
              status: "failed",
              message: "You're not a registered user!",
            });
          }
        } else {
          return res.send({ status: "failed", message: "Email is required!" });
        }
      } catch (error) {
        console.log(error);
        return res.status(400).send({ status: "failed", message: error });
      }
    }

    static resetPasswordFromLink = async (req, res) => {
      try {
        const user = await User.findById(req.params.userId);
        if (user) {
          const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
          });

          if (token) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashedPassword;
            await user.save();
            await token.deleteOne();

            res.send({ status: "success", message: "Password changed successfully!" })
          } else {
            return res.status(400).send({message: "Invalid link or expired link!"})
          }

        } else {
          return res.send({
            status: "failed",
            message: "You're not a registered user!",
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(400).send({ status: "failed", message: error });
      }
    }
};

function generatePasswordResetEmail(name, resetLink) {


  return `Hi ${name},

You requested a password reset. To proceed, click the link below within 15 minutes:
  
${resetLink}
  
If you didn't request a password reset, please ignore this email.

Got questions or concerns? Contact us anytime at ${process.env.USER}. We're always happy to help.
  
Best regards,
PresIN Team`;
}

module.exports = UserController;