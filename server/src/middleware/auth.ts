import { Request, Response, NextFunction } from 'express';
import { createClerkClient, verifyToken } from '@clerk/backend';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

interface AuthRequest extends Request {
  user?: {
    clerkId: string;
    email: string;
    name?: string;
    id?: string;
  };
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
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
    const primaryEmail = user.emailAddresses.find((email: any) => email.id === user.primaryEmailAddressId);
    if (!primaryEmail) {
      return res.status(401).json({ error: 'No primary email found' });
    }

    req.user = {
      clerkId: payload.sub, // Use the user ID from the verified token
      email: primaryEmail.emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const validateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const { PrismaUserRepository } = await import('../repositories/PrismaUserRepository');
    const { UserService } = await import('../services/UserService');
    
    const userRepository = new PrismaUserRepository();
    const userService = new UserService(userRepository);
    
    // Get or create user in database
    const dbUser = await userService.getOrCreateUser(
      req.user.clerkId,
      req.user.email,
      req.user.name
    );
    
    req.user = { ...req.user, id: dbUser.id };
    next();
  } catch (error) {
    console.error('Error validating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
