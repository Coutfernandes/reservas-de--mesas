import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rocket, Utensils, Anchor, Salad, MapPin, Users, CalendarClock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  zone: string;
}

interface Table {
  id: number;
  capacity: number;
  quantity: number;
  restaurant: number;
}

const zoneIcons: { [key: string]: React.ReactNode } = {
  "Space Port": <Rocket className="w-4 h-4 text-cyan-400" />,
  "Medieval Kingdom": <Utensils className="w-4 h-4 text-amber-400" />,
  "Pirate Cove": <Anchor className="w-4 h-4 text-blue-400" />,
  "Prehistoric Jungle": <Salad className="w-4 h-4 text-emerald-400" />,
};

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ icon, label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

// Pega a URL dinâmica do Vercel/Railway ou usa o localhost como fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function ReservationForm() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    restaurant: '',
    table: '',
    visit_datetime: '',
    number_of_guests: 2,
  });
  
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRest, resTable] = await Promise.all([
          axios.get<Restaurant[]>(`${API_BASE_URL}/api/restaurants/`),
          axios.get<Table[]>(`${API_BASE_URL}/api/tables/`)
        ]);
        setRestaurants(resRest.data);
        setTables(resTable.data);
      } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        setStatus({ type: 'error', message: 'Não foi possível conectar ao servidor backend.' });
      }
    };
    fetchData();
  }, []);

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRestaurantId = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      restaurant: selectedRestaurantId, 
      table: '' 
    }));

    if (selectedRestaurantId) {
      const restaurantTables = tables.filter(
        t => t.restaurant === parseInt(selectedRestaurantId)
      );
      setFilteredTables(restaurantTables);
    } else {
      setFilteredTables([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    if (!formData.restaurant || !formData.table) {
        setStatus({ type: 'error', message: 'Selecione o restaurante e o tipo de mesa.' });
        setLoading(false);
        return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/reservations/`, formData);
      const selectedRestaurantName = restaurants.find(r => r.id === parseInt(formData.restaurant))?.name;
      setStatus({ 
        type: 'success', 
        message: `Reserva confirmada no ${selectedRestaurantName}. Sua aventura está garantida.` 
      });
      setFormData({ guest_name: '', guest_email: '', restaurant: '', table: '', visit_datetime: '', number_of_guests: 2 });
      setFilteredTables([]);
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = errorData ? errorData[Object.keys(errorData)[0]][0] : 'Erro ao realizar reserva.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 px-4">
      {/* Cabeçalho minimalista centralizado */}
      <div className="mb-6 space-y-1 text-center">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-medium">
          Sabores que fazem parte da aventura
        </span>
      </div>

      {/* Cartão principal do formulário */}
      <div className="bg-[#0b1021]/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 overflow-hidden p-6 sm:p-8">
        <div className="mb-6 border-b border-slate-800/80 pb-4">
          <h2 className="text-xl font-semibold text-white tracking-wide">Envie sua reserva</h2>
          <p className="text-slate-400 text-xs mt-1">Preencha os campos abaixo para solicitar seu lugar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <InputField icon={<Users className="w-3.5 h-3.5 text-cyan-400" />} label="Nome completo">
            <input 
              type="text" 
              placeholder="Ana Beatriz Rocha"
              className="w-full px-4 py-2.5 bg-[#060913] border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition"
              value={formData.guest_name}
              onChange={(e) => setFormData(prev => ({...prev, guest_name: e.target.value}))}
              required
            />
          </InputField>

          <InputField icon={<MapPin className="w-3.5 h-3.5 text-cyan-400" />} label="E-mail">
            <input 
              type="email" 
              placeholder="voce@email.com"
              className="w-full px-4 py-2.5 bg-[#060913] border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition"
              value={formData.guest_email}
              onChange={(e) => setFormData(prev => ({...prev, guest_email: e.target.value}))}
              required
            />
          </InputField>

          <InputField icon={<MapPin className="w-3.5 h-3.5 text-cyan-400" />} label="Escolha o restaurante">
            <div className="relative">
              {formData.restaurant && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {zoneIcons[restaurants.find(r => r.id === parseInt(formData.restaurant))?.zone || ""]}
                </div>
              )}
              <select 
                className={`w-full ${formData.restaurant ? 'pl-10' : 'px-4'} py-2.5 bg-[#060913] border border-slate-800 rounded-lg text-slate-100 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition appearance-none cursor-pointer`}
                value={formData.restaurant}
                onChange={handleRestaurantChange}
                required
              >
                <option value="" className="bg-[#060913] text-slate-500">Selecione o restaurante...</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#060913] text-slate-100">
                    {r.name} ({r.zone})
                  </option>
                ))}
              </select>
            </div>
          </InputField>

          <InputField icon={<Utensils className="w-3.5 h-3.5 text-cyan-400" />} label="Tipo de mesa">
            <select 
              className="w-full px-4 py-2.5 bg-[#060913] border border-slate-800 rounded-lg text-slate-100 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              value={formData.table}
              onChange={(e) => setFormData(prev => ({...prev, table: e.target.value}))}
              required
              disabled={!formData.restaurant}
            >
              <option value="" className="bg-[#060913] text-slate-500">
                {formData.restaurant ? "Selecione a mesa..." : "Escolha o restaurante primeiro"}
              </option>
              {filteredTables.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#060913] text-slate-100">
                  Mesa para {t.capacity} pessoas ({t.quantity} disp.)
                </option>
              ))}
            </select>
          </InputField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField icon={<Users className="w-3.5 h-3.5 text-cyan-400" />} label="Quantidade de pessoas">
              <input 
                type="number" 
                min="1" max="12"
                className="w-full px-4 py-2.5 bg-[#060913] border border-slate-800 rounded-lg text-slate-100 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition"
                value={formData.number_of_guests}
                onChange={(e) => setFormData(prev => ({...prev, number_of_guests: Number(e.target.value)}))}
                required
              />
            </InputField>

            <InputField icon={<CalendarClock className="w-3.5 h-3.5 text-cyan-400" />} label="Data e horário">
              <input 
                type="datetime-local" 
                className="w-full px-3 py-2.5 bg-[#060913] border border-slate-800 rounded-lg text-slate-100 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition [color-scheme:dark]"
                value={formData.visit_datetime}
                onChange={(e) => setFormData(prev => ({...prev, visit_datetime: e.target.value}))}
                required
              />
            </InputField>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'PROCESSANDO...' : 'CONFIRMAR RESERVA'}
          </button>
        </form>

        {status.message && (
          <div className={`mt-4 p-3 text-xs font-medium rounded-lg flex items-center gap-2 ${
            status.type === 'success' 
              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/50' 
              : 'bg-red-950/40 text-red-300 border border-red-900/50'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}