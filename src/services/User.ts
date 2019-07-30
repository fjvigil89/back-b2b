import * as jwt from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "../entity";

export class UserService {

    public async validUser(userId: string, password: string): Promise<{token: string, user: string}> {
        const user = await User.findOne({ where: { name: userId }});

        if (!user) {
            throw new Error("No existe el usuario");
        }

        if (user.password !== password) {
            throw new Error("Contraseña incorrecta");
        }

        return {
            token: jwt.sign({ userId: user.id, name: user.name }, config.SECRET),
            user: user.name,
        };
    }

}
