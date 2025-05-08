const User = require("@/db/models/user");

const setupAdmin = async () => {
    const AdminEmail = process.env.ADMIN_EMAIL;
    console.log("Configuring admin email...");

    if (!AdminEmail) {
        console.error("❌ Admin email is not found in environment variables.");
        return;
    }

    const admin = await User.findOne({ email: AdminEmail });

    if (!admin) {
        console.error("❌ No user found with the admin email.");
        return;
    }

    admin.role = "admin";
    await admin.save();

    console.log(`✅ Admin email confihuration complete.`);
};

module.exports = setupAdmin;
