"use client";
import { useEffect, useState } from "react";
import Login from "../../components/Login";
import { supabase } from "../../lib/supabaseClient";

export default function Account() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="p-4">
        <h2 className="text-xl mb-4">Melde dich an:</h2>
        <Login />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">Willkommen, {user.email}</h1>
      <p>Dein Account ist aktiv. Hier kannst du deine Daten verwalten.</p>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Ausloggen
      </button>
    </div>
  );
}
