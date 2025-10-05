import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



/**
 * @desc    Get all users
 * @route   GET /api/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // hide password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

/**
 * @desc    Get a single user by ID
 * @route   GET /api/users/:id
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

/**
 * @desc    Create new user (Register)
 * @route   POST /api/users
 */
export const createUser = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: 'Something is missing',
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });
        const tokenData = { userId: newUser._id, role: newUser.role };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201)
            .cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: "User created successfully",
                user: { ...newUser._doc, password: undefined },
                success: true
            });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Something is missing',
                success: false
            });
        }

        // ✅ Await the findOne
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        // ✅ Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Incorrect Email or Password',
                success: false
            });
        }

        // ✅ Check role
        if (role !== user.role) {
            return res.status(400).json({
                message: 'Account is not available for this role',
                success: false
            });
        }

        // ✅ Create JWT token
        const tokenData = { userId: user._id, role: user.role };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        // ✅ Return user info (without overwriting `user`)
        const userData = {
            _id: user._id,
            name: user.fullname,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
        };

        return res.status(200)
            .cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back ${user.fullname}`,
                user: userData,
                success: true
            });

    } catch (error) {
        res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};


/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 */
export const updateUser = async (req, res) => {
    try {
        const { name, phoneNumber, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, phoneNumber, role },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
}
