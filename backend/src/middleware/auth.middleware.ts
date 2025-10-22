import express, { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config'; 

declare global {
  namespace Express {
    interface Request {
      user?: { sub: string; name: string; role: string }; // Use a estrutura do seu payload aqui
    }
  }
}

export const verifyToken = (req: express.Request, res: express.Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const userPayload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = userPayload as { sub: string; name: string; role: string }; // Adiciona o payload decodificado à requisição
    next(); // Se o token for válido, continua para a rota
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Primeiro, verifica se o usuário foi autenticado e anexado à requisição
    if (!req.user) {
      return res.status(403).json({ message: 'Acesso negado. Usuário não autenticado.' });
    }

    const { role } = req.user;

    // Verifica se a role do usuário está na lista de roles permitidas
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para acessar este recurso.' });
    }

    // Se a role for permitida, continua para a próxima função (o controller da rota)
    next();
  };
};
