import supabase from '../config/supabase.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const createUserService = async (userData) => {
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(userData.usu_senha, saltRounds);
        userData.usu_senha = hash;
        const { data, error } = await supabase
            .from('Usuarios')
            .insert(userData)
            .single();
        if (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
        return data;
    }
    catch (error) {
        console.error("Error in createUserService:", error);
        throw new Error("Error creating user");
    }
};
export const loginUser = async (loginData) => {
    try {
        const { data: user, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('usu_nome', loginData.nome)
            .single();
        if (error || !user) {
            throw new Error("Usuário não encontrado ou credenciais inválidas.");
        }
        const isPasswordCorrect = await bcrypt.compare(loginData.senha, user.usu_senha);
        if (!isPasswordCorrect) {
            throw new Error("Usuário não encontrado ou credenciais inválidas.");
        }
        const payload = {
            sub: user.usu_id,
            name: user.usu_nome,
            role: user.usu_typeUser
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        delete user.usu_senha;
        return { token: token };
    }
    catch (error) {
        throw error;
    }
};
//# sourceMappingURL=userService.js.map