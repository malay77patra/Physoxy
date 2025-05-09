const Package = require("@/db/models/package");
const User = require("@/db/models/user");
const { packageSchema } = require("@/utils/validations");

const addPackage = async (req, res) => {
    try {
        const validaedPackage = await packageSchema.validate(req.body, { abortEarly: false });

        const packageData = {
            name: validaedPackage.name,
            description: validaedPackage.description,
            pricing: validaedPackage.pricing,
        }
        const preExistingPackage = await Package.find({ name: packageData.name });
        if (preExistingPackage.length > 0) {
            return res.status(400).json({
                message: "Package already exists",
                details: "package with this name already exists"
            });
        }
        const newPackage = new Package(packageData);
        await newPackage.save();
        return res.status(201).json(newPackage);

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.errors[0] || "Input package data is invalid.",
                details: "provided package data is invalid"
            });
        }

        throw error;
    }
}

const deletePackage = async (req, res) => {
    const { id } = req.params;
    const deleteablePackage = await Package.findById(id);
    if (!deleteablePackage) {
        return res.status(404).json({
            message: "Package not found",
            details: "package with this id does not exist"
        });
    }

    const now = new Date();
    const users = await User.find({ subscription: id })
        .populate({
            path: 'subscription',
            match: { endsAt: { $gt: now } }
        });
    const subscribedUsers = users.filter(user => user.subscription !== null);

    if (subscribedUsers.length > 0) {
        return res.status(403).json({
            message: "Package is in use and cannot be deleted",
            details: "package is in use by some users"
        });
    }

    const deletedPackage = await Package.findByIdAndDelete(id);

    return res.status(200).json(deletedPackage);
}

const updatePackage = async (req, res) => {
    const { id } = req.params;
    const { name, description, pricing } = req.body;
    const package = await Package.findById(id);

    if (!package) {
        return res.status(404).json({
            message: "Package not found",
            details: "package with this id does not exist"
        });
    }

    const updateablePackage = {
        name: name || package.name,
        description: description || package.description,
        pricing: pricing || package.pricing,
    }

    try {
        const validatedPackage = await packageSchema.validate(updateablePackage, { abortEarly: false });
        const updatedPackage = await Package.findByIdAndUpdate(id, validatedPackage, { new: true });

        return res.status(200).json(updatedPackage);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.errors[0] || "Input package data is invalid.",
                details: "provided package data is invalid"
            });
        }

        throw error;
    }
}


module.exports = { addPackage, deletePackage, updatePackage };
