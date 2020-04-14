"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const english = require('./english.json');
const word_model_1 = __importStar(require("../models/word.model"));
async function run() {
    await english.forEach(async (word) => {
        await word_model_1.default.findOneAndUpdate({ label: word, language: word_model_1.Language.English }, { upsert: true }).catch(error => {
            throw error;
        });
    });
}
exports.default = run;
//# sourceMappingURL=insert.js.map