const Role = require('../models/Role.js');
const StringUtils = require('../utils/StringUtils.js');
require('dotenv').config();

class roleController {
    static addRole = async (req, res) => {
        try {
          const role = req.body.roleName;
          if (!role) {
            return res.status(400).json({ message: "Role is required!" });
          }
          const existingRole = await Role.findOne({roleName: { $regex: new RegExp('^'+role+'$', "i") }});
          if (existingRole) {
            return res.status(400).json({ message: "Role already exists!" });
          }
  
          await Role.create({ roleName: StringUtils.capitalizeFirstLetterFromWord(role) });
          res.status(200).send({ message: "Role added successfully!" });
  
        } catch (error) {
          console.log(error);
          res.status(400).send({ message: error });
        }
      }

      static getAllRoles = async (req, res) => {
        try {
          const roles = await Role.find();
          if (!roles || roles.length == 0) return res.status(404).json({ message: "No roles found!" });

          res.status(200).send({ roles });

        } catch (error) {
          console.log(error);
          res.status(400).json({ message: error });
        }
      }
}

module.exports = roleController;