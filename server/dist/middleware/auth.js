"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.authenticateUser = void 0;
const backend_1 = require("@clerk/backend");
const clerk = (0, backend_1.createClerkClient)({ secretKey: process.env.CLERK_SECRET_KEY });
const authenticateUser = async (req, res, next) => {
    try {
        console.log('🔍 Auth middleware - Headers:', req.headers);
        console.log('🔍 Auth middleware - CLERK_SECRET_KEY exists:', !!process.env.CLERK_SECRET_KEY);
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ No authorization header or invalid format');
            return res.status(401).json({ error: 'Authorization header required' });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log('🔍 Token received (first 20 chars):', token.substring(0, 20) + '...');
        // Verify the token with Clerk using the new networkless verification
        const payload = await (0, backend_1.verifyToken)(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });
        if (!payload) {
            console.log('❌ Invalid token');
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.log('✅ Token verified successfully, user ID:', payload.sub);
        // Get user information from Clerk
        const user = await clerk.users.getUser(payload.sub);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Extract email from primary email address
        const primaryEmail = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId);
        if (!primaryEmail) {
            return res.status(401).json({ error: 'No primary email found' });
        }
        req.user = {
            clerkId: payload.sub, // Use the user ID from the verified token
            email: primaryEmail.emailAddress,
            name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined,
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};
exports.authenticateUser = authenticateUser;
const validateUser = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const { PrismaUserRepository } = await Promise.resolve().then(() => __importStar(require('../repositories/PrismaUserRepository')));
        const { UserService } = await Promise.resolve().then(() => __importStar(require('../services/UserService')));
        const userRepository = new PrismaUserRepository();
        const userService = new UserService(userRepository);
        // Get or create user in database
        const dbUser = await userService.getOrCreateUser(req.user.clerkId, req.user.email, req.user.name);
        req.user = { ...req.user, id: dbUser.id };
        next();
    }
    catch (error) {
        console.error('Error validating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validateUser = validateUser;
