const User = require("@/db/models/user");

const setupOwner = async () => {
    const ownerEmail = process.env.OWNER_EMAIL;
    console.log("Configuring owner email...");

    if (!ownerEmail) {
        console.error("❌ Owner email is not found in environment variables.");
        return;
    }

    const owner = await User.findOne({ email: ownerEmail });

    if (!owner) {
        console.error("❌ No user found with the owner email.");
        return;
    }

    owner.role = "owner";
    await owner.save();

    console.log(`✅ Owner email confihuration complete.`);
};

module.exports = setupOwner;
