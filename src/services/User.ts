import * as jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { config } from "../config/config";
import { User } from "../entity";
import { getUser } from "../services/external/Principal";

export class UserService {

    public async validUser(userId: string, password: string): Promise<{ token: string, user: string }> {
        const client = await getUser(userId);
        const user = await getConnection(client).getRepository(User).findOne({ where: { name: userId } });

        if (!user) {
            throw new Error("No existe el usuario");
        }

        if (user.password !== password) {
            throw new Error("Contraseña incorrecta");
        }

        console.log({
            userId: user.id,
            name: user.name,
            email: user.email,
            client: client.toLocaleLowerCase(),
        });

        return {
            token: jwt.sign({
                userId: user.id,
                name: user.name,
                email: user.email,
                client: client.toLocaleLowerCase(),
            }, config.SECRET),
            user: user.name,
        };
    }

}
