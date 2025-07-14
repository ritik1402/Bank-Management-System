import User from "./models/user.js";
import Role from "./models/role.js";
import BankDetails from "./models/bankDetail.js";


User.hasOne(Role, { foreignKey: "userId" });
Role.belongsTo(User, { foreignKey: "userId" });

User.hasOne(BankDetails, { foreignKey: "userId" });
BankDetails.belongsTo(User, { foreignKey: "userId" });
