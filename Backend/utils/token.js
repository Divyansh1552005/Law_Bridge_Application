import jwt from "jsonwebtoken";
import {TokenSchema} from "../validations/tokenValidation.js";
const JWT_SECRET = process.env.JWT_SECRET;

export async function createToken(payload){
    const validationResult = await TokenSchema.safeParseAsync(payload);

    if(validationResult.error) throw new Error(validationResult.error.message);

    const payloadValidatedData = validationResult.data;

    const token = jwt.sign(payloadValidatedData, JWT_SECRET, {expiresIn: '2d'});
    return token;
}

export function validateToken(token){
    try{
    const payload = jwt.verify(token, JWT_SECRET);
    return payload
    }catch(error){
        return null;
    }
}

