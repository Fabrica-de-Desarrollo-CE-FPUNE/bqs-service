import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const firmarToken = (data:any)=>{
    return  jwt.sign(data, JWT_SECRET);
}