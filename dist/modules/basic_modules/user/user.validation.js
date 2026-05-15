"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const loginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required!",
            invalid_type_error: "Email must be a string",
        })
            .email(),
        password: zod_1.z.string({
            required_error: "password is required!",
            invalid_type_error: "password must be a string",
        }),
    }),
});
const registerUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required!",
            invalid_type_error: "name must be a string",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required!",
            invalid_type_error: "Email must be a string",
        })
            .email(),
        password: zod_1.z
            .string({
            required_error: "password is required!",
            invalid_type_error: "password must be a string",
        })
            .min(6, "Password must be at least 6 characters long"),
        confirmPassword: zod_1.z
            .string({
            required_error: " confirmPassword is required!",
            invalid_type_error: " confirmPassword must be a string",
        })
            .min(6, " confirmPassword must be at least 6 characters long"),
    }),
});
const updateUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required!",
            invalid_type_error: "name must be a string",
        }).optional(),
        image: zod_1.z.string({
            required_error: "name is required!",
            invalid_type_error: "name must be a string",
        }).optional(),
    }),
});
const resetPassWordValidation = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string({
            required_error: "password is required!",
            invalid_type_error: "password must be a string",
        })
            .min(6, "Password must be at least 6 characters long"),
        confirmPassword: zod_1.z
            .string({
            required_error: "confirmPassword is required!",
            invalid_type_error: " confirmPassword must be a string",
        })
            .min(6, "confirmPassword must be at least 6 characters long"),
    }),
});
exports.userValidation = {
    registerUserValidation,
    loginValidation,
    resetPassWordValidation,
    updateUserValidation
};
