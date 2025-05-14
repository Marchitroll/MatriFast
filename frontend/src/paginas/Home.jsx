import supabase from "../config/ClienteSupabase";

function Home() {
  console.log(supabase)
  console.log("Conexión a Supabase exitosa");
  
  return (
    <div className="page home">
      <h2>Bienvenido al Sistema de Matrículas Online</h2>
    </div>
  );
}

export default Home;
