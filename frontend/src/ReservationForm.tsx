import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Restaurant {
  id: number;
  name: string;
  zone: string;
}

export function ReservationForm() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    restaurant: '',
    table: '',
    visit_datetime: '',
    number_of_guests: 2,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Buscar restaurantes da API do Django
    axios.get('http://localhost:8000/api/restaurants/')
      .then(response => setRestaurants(response.data))
      .catch(error => console.error('Erro ao carregar restaurantes:', error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/reservations/', formData);
      setMessage('Reserva realizada com sucesso! Bom passeio no parque temática!');
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData) {
        const firstKey = Object.keys(errorData)[0];
        setMessage(`Erro: ${errorData[firstKey][0]}`);
      } else {
        setMessage('Erro ao realizar reserva.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Reserva de Mesas - Parque</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nome do Convidado</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.guest_name}
            onChange={(e) => setFormData({...formData, guest_name: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">E-mail</label>
          <input 
            type="email" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.guest_email}
            onChange={(e) => setFormData({...formData, guest_email: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Restaurante</label>
          <select 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.restaurant}
            onChange={(e) => setFormData({...formData, restaurant: e.target.value})}
            required
          >
            <option value="">Selecione um restaurante</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name} ({r.zone})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Número de Convidados</label>
          <input 
            type="number" 
            min="1" max="12"
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.number_of_guests}
            onChange={(e) => setFormData({...formData, number_of_guests: Number(e.target.value)})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Data e Hora da Visita</label>
          <input 
            type="datetime-local" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.visit_datetime}
            onChange={(e) => setFormData({...formData, visit_datetime: e.target.value})}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Confirmar Reserva
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );
}