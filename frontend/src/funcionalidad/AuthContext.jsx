import { useContext, useState, createContext, useEffect } from "react";
import supabase from "../config/ClienteSupabase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined)

    // Registro de usuario
    const registrarNuevoUsuario = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            console.error('Error al registrar el usuario:', error);
            return {success: false, error: error.message};
        }
        return {success: true, data: data};
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
        supabase.auth.onAuthStateChange(( _event, session) => {
            setSession(session)
        })
    }, [])

    // Validar email
    const validarEmail = (email) => {
        // Expresión regular simple para validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar contraseña
    const validarPassword = (password) => {
        // Valida que la contraseña tenga más de 6 caracteres
        return password.length > 6;
    }

    // Iniciar sesion
    const iniciarSesion = async ({email, password}) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) {
                console.error('Error al iniciar sesión:', error);
                return {success: false, error: error.message};
            }
            return {success: true, data: data};
        } catch (error) {
            console.error('Error inesperado al iniciar sesión:', error);
            return {success: false, error: 'Error inesperado durante el inicio de sesión'};
        }
    }

    // Salida de sesion
    const cerrarSesion = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Error al cerrar sesión:', error);
            return {success: false, error: error.message};
        }
        return {success: true};
    }

const obtenerUsuarioActual = async () => {
  const { data: { session }, error: errSession } = await supabase.auth.getSession();
  if (errSession || !session?.user) return null;

  const { email } = session.user;

  // 1️⃣ Buscar el usuario general
  const { data: usuario, error: errUsuario } = await supabase
    .from('Usuario')
    .select('id, email, idRol')
    .eq('email', email)
    .maybeSingle();

  if (errUsuario || !usuario) {
    console.error('Usuario no encontrado en tabla Usuario:', errUsuario);
    return null;
  }

  // Opcional: cargar roles desde tabla Rol
  const { data: rolData, error: errRol } = await supabase
    .from('Rol')
    .select('valor')
    .eq('id', usuario.idRol)
    .maybeSingle();

  const role = rolData?.valor?.toUpperCase();

  // 2️⃣ Según el rol, buscar perfil extenso
  if (role === 'DOCENTE') {
    const { data: docente, error } = await supabase
      .from('Docente')
      .select('*')
      .eq('idUsuario', usuario.id)
      .maybeSingle();

    if (error) {
      console.error('Error al cargar perfil Docente:', error);
      return null;
    }
    return { ...docente, email, role, id: usuario.id };
  }

  if (role === 'REPRESENTANTE LEGAL') {
    const { data: representante, error } = await supabase
      .from('RepresentanteLegal')
      .select('*')
      .eq('idUsuario', usuario.id)
      .maybeSingle();

    if (error) {
      console.error('Error al cargar perfil RepresentanteLegal:', error);
      return null;
    }
    return { ...representante, email, role, id: usuario.id };
  }

  console.warn('Rol no contemplado en obtenerUsuarioActual:', role);
  return null;
};

    return (
        <AuthContext.Provider value={{ session, registrarNuevoUsuario, cerrarSesion, iniciarSesion, validarEmail, validarPassword, obtenerUsuarioActual }}>
            {children}
        </AuthContext.Provider>
    )
}




export const useAuth = () => {
    return useContext(AuthContext);
}