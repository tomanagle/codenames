"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Language;
(function (Language) {
    Language["English"] = "English";
    Language["Adult"] = "Adult";
})(Language = exports.Language || (exports.Language = {}));
const Schema = new mongoose_1.default.Schema({
    label: { type: String, required: true, unique: true },
    language: { type: String, enum: ['English', 'Adult'] },
}, 
// Adds createdAt and updatedAt to the model
{ timestamps: true });
exports.default = mongoose_1.default.model('Word', Schema);
//# sourceMappingURL=word.model.js.map