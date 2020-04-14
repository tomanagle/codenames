"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
describe('App', () => {
    it(`Should return Hello ${app_1.world}`, () => {
        expect.assertions(1);
        expect(app_1.hello()).toBe(`Hello ${app_1.world}`);
    });
});
//# sourceMappingURL=app.test.js.map