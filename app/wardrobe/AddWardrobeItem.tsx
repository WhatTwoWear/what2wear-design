'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export default function AddWardrobeItem() {
  const [userId, setUserId] = useState<string | null>(null);
  const [types, setTypes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [fits, setFits] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [fabrics, setFabrics] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    clothing_type_id: '',
    color_id: '',
    fit_id: '',
    pattern_id: '',
    fabric_id: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const user = await supabase.auth.getUser();
      setUserId(user.data.user?.id ?? null);

      const [t, c, f, p, fa] = await Promise.all([
        supabase.from('clothing_types').select('*'),
        supabase.from('colors').select('*'),
        supabase.from('fits').select('*'),
        supabase.from('patterns').select('*'),
        supabase.from('fabrics').select('*'),
      ]);

      setTypes(t.data || []);
      setColors(c.data || []);
      setFits(f.data || []);
      setPatterns(p.data || []);
      setFabrics(fa.data || []);
    };

    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert('Nicht eingeloggt');

    const { error } = await supabase.from('wardrobe_items').insert({
      user_id: userId,
      clothing_type: formData.clothing_type_id,
      color_id: formData.color_id,
      fit_id: formData.fit_id,
      pattern_id: formData.pattern_id,
      fabric_id: formData.fabric_id,
    });

    if (error) {
      alert('Fehler beim Speichern');
      console.error(error);
    } else {
      alert('Gespeichert!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField label="Kleidungsart" name="clothing_type_id" options={types} onChange={handleChange} />
      <SelectField label="Farbe" name="color_id" options={colors} onChange={handleChange} />
      <SelectField label="Schnitt" name="fit_id" options={fits} onChange={handleChange} />
      <SelectField label="Muster" name="pattern_id" options={patterns} onChange={handleChange} />
      <SelectField label="Stoff" name="fabric_id" options={fabrics} onChange={handleChange} />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">Hinzufügen</button>
    </form>
  );
}

function SelectField({ label, name, options, onChange }: any) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <select name={name} onChange={onChange} required className="w-full border rounded p-2">
        <option value="">– auswählen –</option>
        {options.map((item: any) => (
          <option key={item.id} value={item.id}>
            {item.icon ? `${item.icon} ` : ''}{item.name || item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
