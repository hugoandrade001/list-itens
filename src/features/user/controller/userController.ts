import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public listAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.listAllUsers();
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email, and password are required"
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                })
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long"
                })
            }

            const user = await this.userService.create(req.body)
            
            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user
            })

        } catch(error: any) {
            if (error.message === "User with this email already exists") {
                return res.status(409).json({
                    success: false,
                    message: error.message
                })
            }
            next(error);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email, and password are required to delete a User!"
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email!"
                })
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password is wrong!"
                })
            }

            const userDeleted = await this.userService.deleteUser(parseInt(req.params.id))

            res.status(201).json({
                success: true,
                message: 'User deleted successfully',
                data: userDeleted
            })
        } catch (error: any) {
            if (error.message === "User with ID: {$id} not found") {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
            next(error)
        }
    }

    public login = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                })
            }

            const result = await this.userService.login(email, password)
            
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: result
            })

        } catch (error: any) {
            if (error.message === "User not found, try register!" || error.message === "Password does not match") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                })
            }
            next(error)
        }
    }
}

export default UserController;