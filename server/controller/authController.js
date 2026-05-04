import User from '../models/User.js'; // ES module syntax
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// Registration function (already exisis)
export async function registerUser(req, res) {
 try {
    const { fullName, idNumber, accountNumber, password, role } = req.body;

    // 1. Input validation (basic, for production use express-validator)
//    if (!fullName || !idNumber || !accountNumber || !password) {
//      return res.status(400).json({ message: 'All fields are required.' });
//    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) {
      return res.status(409).json({ message: 'Account already exists.' });
    }

    // 3. Hash password with pepper
    const passwordWithPepper = password + process.env.PEPPER;
    const passwordHash = await argon2.hash(passwordWithPepper);

    // 4. Create and save user
    const user = new User({
      fullName,
      idNumber,
      accountNumber,
      passwordHash,
      role: role || 'customer'
    });
    await user.save();

    // 5. Respond (do not send passwordHash)
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        accountNumber: user.accountNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}

// Login function (newly added)
export async function loginUser(req, res) {
  try {
    const { accountNumber, password } = req.body;
    // Find user by account number
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

      // Add pepper to password and verify
      const passwordWithPepper = password + process.env.PEPPER;
      const validPassword = await argon2.verify(user.passwordHash, passwordWithPepper);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role
            }
        });
         } catch (error) {
            res.status(500).json({ error: 'Login failed'}); 
         }
    }


