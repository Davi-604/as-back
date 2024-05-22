import { RequestHandler } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth';

export const login: RequestHandler = (req, res) => {
    const loginSchema = z.object({
        password: z.string(),
    });
    const body = loginSchema.safeParse(req.body);

    if (!body.success) return res.json({ error: 'Dados inválidos' });

    if (!authService.validatePassword(body.data.password)) {
        return res.status(403).json({ error: 'Senha inválida!' });
    }

    res.json({ token: authService.createToken() });
};

export const validate: RequestHandler = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.json({ error: 'Acesso negado' });
    }

    const [tokenType, token] = req.headers.authorization.split(' ');
    if (!authService.validateToken(token)) {
        return res.json({ error: 'Acesso negado' });
    }

    next();
};
