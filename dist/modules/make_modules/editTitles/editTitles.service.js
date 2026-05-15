"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTitleService = void 0;
const seedData_1 = require("../../../utils/seedData");
const editTitles_model_1 = require("./editTitles.model");
const updateEditTitleDB = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    // 🔥 RESET CASE
    if (payload.reset) {
        const result = yield editTitles_model_1.EditTitleModel.findOneAndUpdate({ user_id }, {
            $set: {
                titles: seedData_1.seedEditTitles,
            },
        }, { new: true, upsert: true });
        return result;
    }
    const result = yield editTitles_model_1.EditTitleModel.findOneAndUpdate({
        user_id,
        "titles._id": payload._id,
    }, {
        $set: {
            "titles.$.name": payload.name,
        },
    }, { new: true });
    return result;
});
const getSingleEditTitleDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const doc = yield editTitles_model_1.EditTitleModel.findOne({ "titles._id": id }, { "titles.$": 1 });
    return ((_a = doc === null || doc === void 0 ? void 0 : doc.titles) === null || _a === void 0 ? void 0 : _a[0]) || null;
});
const myEditTitleDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield editTitles_model_1.EditTitleModel.find({ user_id: id });
    return doc;
});
exports.editTitleService = {
    updateEditTitleDB, getSingleEditTitleDB, myEditTitleDB
};
