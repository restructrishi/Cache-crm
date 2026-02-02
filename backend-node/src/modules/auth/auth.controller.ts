import { login } from './auth.service'
import { Request, Response } from 'express'

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const result = await login(email, password)
    res.json(result)
  } catch (e) {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}
