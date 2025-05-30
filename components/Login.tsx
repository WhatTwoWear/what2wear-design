"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Eingeloggt!");
      window.location.reload(); 
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Registrierung erfolgreich! Bitte E-Mail bestätigen.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <input
        type="email"
        placeholder="E-Mail"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Passwort"
        className="border p-2 w-full mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading} className="bg-gray-800 text-white p-2">
        Einloggen
      </button>
      <button onClick={handleSignUp} disabled={loading} className="ml-2 bg-gray-500 text-white p-2">
        Registrieren
      </button>
    </div>
  );
}
