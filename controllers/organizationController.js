const Organization = require("../models/Organization.js");


class organizationController {

    static allOrganizations = async (req, res) => {
        try {
            const listOfAllOrganizations = await Organization.find({});
            if (!listOfAllOrganizations || listOfAllOrganizations.length == 0) {
                return res.status(400).send({ status: 400, message: "No organizations found!"});
            }

            res.status(200).send({ status: 200, message: "All organizations fetched successfully!", data: listOfAllOrganizations});

        } catch (error) {
            console.log(error);
            res.status(400).send({ status: 400, message: `Something went wrong! ${error}`});
        }
    }


    static addOrganization = async (req, res) => {
        try {
            const { organizationName, organizationLocation, organizationEmail, organizationWebsite } = req.body;
            if (!organizationName || !organizationLocation) {
              return res.status(400).send({ status: 400, message: "All fields are required!"});
            }

            const existingOrganization = await Organization.findOne({ organizationName: { $regex: new RegExp('^'+organizationName+'$', "i") } });
            if (existingOrganization) {
                return res.status(400).send({ status: 400, message: 'Organization already exists!' });
            }

            const organization = new Organization({
                organizationName, organizationLocation, organizationEmail, organizationWebsite
            });

            await organization.save();
            res.status(200).send({ status: 200, message: "Organization added successfully!"});

        } catch (error) {
            console.log(error);
            res.status(400).send({ status: 400, message: `Something went wrong! ${error}`});
        }
    }


    static getOrganizationById = async (req, res) => {
        try {
            const organizationIsPresent = await Organization.findById(req.params.id);
            if (!organizationIsPresent) {
                return res.status(404).send({ status: 404, message: "Organization not found!"});
            }
            res.status(200).send({status: 200, message: "Organization fetched successfully!", data: organizationIsPresent});

        } catch (error) {
            console.error(error);
            if (error.name === 'CastError') {
              return res.status(400).send({ status: 400, message: `Invalid ${error.path}: ${error.value}` });
            }
            res.status(500).send({ status: 500, message: "Something went wrong!" });
          }
    }

}

module.exports = organizationController;
