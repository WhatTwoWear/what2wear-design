"use client";

import { useEffect, useState } from "react";
import Login from "../../components/Login";
import { supabase } from "../../lib/supabaseClient";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [clothes, setClothes] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchClothingItems = async () => {
        const { data, error } = await supabase
          .from("clothing_items")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) setClothes(data);
      };
      fetchClothingItems();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-100">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Melde dich an</h2>
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`}
            alt="Profilbild"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h1 className="text-2xl font-bold">{user.user_metadata?.name || user.email}</h1>
          <p className="text-gray-500 text-sm">Angemeldet mit Supabase</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="mt-4 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Ausloggen
          </button>
        </div>

        <div className="text-left">
          <h2 className="text-xl font-semibold mb-4">Deine Kleidungsstücke</h2>
          {clothes.length === 0 ? (
            <p className="text-gray-500">Noch keine Kleidungsstücke hinzugefügt.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clothes.map(item => (
                <li key={item.id} className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.category} · {item.color} · {item.brand}
                  </p>
                  <p className="text-xs text-gray-400">
                    Geeignet für {item.suitable_temperature_low}–{item.suitable_temperature_high}°C
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
