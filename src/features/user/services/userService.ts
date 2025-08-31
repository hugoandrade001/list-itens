import { Prisma, PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { NotFoundExcepton, unathorizedException } from "../../../globals/cores/errors"
import jwt from "jsonwebtoken"
const prisma = new PrismaClient()

interface CreateUserData {
    name: string
    email: string
    password: string
}

export class UserService {

    public async listAllUsers(){
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return users
    }

    public async create(userData: CreateUserData) {
        const { name, email, password } = userData

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            throw new Error("User with this email already exists")
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'your-secret-key', 
            { expiresIn: '24h' }
        )

        return {
            token,
            user
        }
    }

    public async readOne(id: number) {

        const user = await prisma.user.findUnique({
            where: {id}
        })

        if (!user) throw new NotFoundExcepton('User with ID: {$id} not found');

    }

    public async deleteUser(id: number) {
        await this.readOne(id)

        await prisma.user.delete({
            where: {id}
        })

    }

    public async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if (!user) {
            throw new NotFoundExcepton('User not found, try register!')
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if(!isValidPassword){
            throw new unathorizedException('Password does not match')
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'your-secret-key', 
            { expiresIn: '24h' }
        )

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }
 }