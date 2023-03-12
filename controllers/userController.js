require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');


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


    static changePassword = async (req, res) => {
        const {password, password_confirmation} = req.body;
        if (password && password_confirmation) {
            if (password === password_confirmation) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                
            } else {
                return res.send({status: "failed", message: "Password and password confirmation must be same!"})
            }
        } else {
            return res.send({status: "failed", message: "All fields are required!"})
        }
    }

};

module.exports = UserController;