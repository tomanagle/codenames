"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.GAME_UPDATED = 'GAME_CREATED';
// Move this into a configuration file
exports.DATABASE_NAME = 'test-database';
exports.IS_DEBUG = process.env.NODE_END === 'development';
//# sourceMappingURL=constants.js.map