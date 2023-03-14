const Organization = require("../models/Organization.js");

const STATUS_SUCCESS = "success";
const STATUS_FAILED = "failed";

class organizationController {

    static allOrganizations = async (req, res) => {
        try {
            const listOfAllOrganizations = await Organization.find({});
            if (!listOfAllOrganizations || listOfAllOrganizations.length == 0) {
                return res.send({status: STATUS_FAILED, message: "No organizations found!"});
            }

            return res.send({status: STATUS_SUCCESS, message: "All organizations fetched successfully!", data: listOfAllOrganizations});

        } catch (error) {
            console.log(error);
            res.status(400).send({ status: STATUS_FAILED, message: `Something went wrong! ${error}`});
        }
    }


    static addOrganization = async (req, res) => {
        try {
            const { organizationName, organizationLocation, organizationEmail } = req.body;
            if (!organizationName || !organizationLocation) {
              return res
                .status(400)
                .send({
                  status: STATUS_FAILED,
                  message: "All fields are required!",
                });
            }

            const existingOrganization = await Organization.findOne({ organizationName: { $regex: new RegExp('^'+organizationName+'$', "i") } });
            if (existingOrganization) {
                return res.status(400).send({ message: 'Organization already exists!' });
            }

            const organization = new Organization({
                organizationName, organizationLocation, organizationEmail
            });
            await organization.save();
            return res.send({status: STATUS_SUCCESS, message: "Organization added successfully!"});

        } catch (error) {
            console.log(error);
            res.status(400).send({ status: STATUS_FAILED, message: `Something went wrong! ${error}`});
        }
    }


    static getOrganizationById = async (req, res) => {
        try {
            const organizationIsPresent = await Organization.findById(req.params.id);
            if (!organizationIsPresent) {
                return res.status(404).send({status: STATUS_FAILED, message: "Organization not found!"});
            }
            return res.send({status: STATUS_SUCCESS, message: "Organization fetched successfully!", data: organizationIsPresent});

        } catch (error) {
            console.error(error);
            if (error.name === 'CastError') {
              return res.status(400).send({ status: STATUS_FAILED, message: `Invalid ${error.path}: ${error.value}` });
            }
            return res.status(500).send({ status: STATUS_FAILED, message: "Something went wrong!" });
          }
    }

}

module.exports = organizationController;
