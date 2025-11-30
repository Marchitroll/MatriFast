import { useContext, useState, createContext, useEffect } from 'react';
import supabase from '../config/ClienteSupabase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const registrarNuevoUsuario = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  const iniciarSesion = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error inesperado durante el inicio de sesión' };
    }
  };

  const cerrarSesion = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarPassword = (password) => password.length > 6;

  const obtenerUsuarioActual = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) return null;

    const { email } = session.user;

    // Obtener usuario y rol
    const { data: usuario } = await supabase
      .from('Usuario')
      .select('id, email, idRol')
      .eq('email', email)
      .maybeSingle();

    if (!usuario) return null;

    const { data: rolData } = await supabase
      .from('Rol')
      .select('valor')
      .eq('id', usuario.idRol)
      .maybeSingle();

    const role = rolData?.valor?.toUpperCase();

    // Obtener datos específicos según rol
    const tabla = role === 'DOCENTE' ? 'Docente' : 
                  role === 'REPRESENTANTE LEGAL' ? 'RepresentanteLegal' : null;

    if (!tabla) return null;

    const { data: perfil } = await supabase
      .from(tabla)
      .select('*')
      .eq('idUsuario', usuario.id)
      .maybeSingle();

    return { ...perfil, email, role, id: usuario.id };
  };

  return (
    <AuthContext.Provider value={{
      session,
      registrarNuevoUsuario,
      cerrarSesion,
      iniciarSesion,
      validarEmail,
      validarPassword,
      obtenerUsuarioActual
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
