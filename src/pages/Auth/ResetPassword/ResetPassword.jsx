import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Obtener el token desde la URL
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Token inválido o expirado");
    }
  }, [token]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setMessage("Por favor ingresa una nueva contraseña");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error al restablecer la contraseña");
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Restablecer</button>
      </form>
    </div>
  );
};

export default ResetPassword;
