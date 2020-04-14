"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function connect({ db }) {
    try {
        await mongoose_1.default
            .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log(`🗄️ Successfully connected to ${db} 🗄️`));
    }
    catch (error) {
        console.log(`🔥 An error ocurred when trying to connect with ${db} 🔥`);
        throw error;
    }
}
exports.default = connect;
//# sourceMappingURL=connect.js.map