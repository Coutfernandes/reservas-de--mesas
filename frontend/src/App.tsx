import { ReservationForm } from './ReservationForm';
import { Utensils, CalendarDays, Sparkles } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between">
      
      {/* Navbar Superior */}
      <header className="border-b border-slate-800/80 bg-[#0b1021]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">ThemePark<span className="text-cyan-400">Dining</span></span>
              <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-semibold">Adventure World</span>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 px-4 py-2 rounded-xl font-medium text-sm transition shadow-sm">
            <CalendarDays className="w-4 h-4 text-cyan-400" />
            Minhas Reservas
          </button>

        </div>
      </header>

      {/* Hero Section e Formulário */}
      <main className="flex-grow px-6 py-10 max-w-7xl mx-auto w-full">
        
        {/* Banner de Boas-Vindas */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Sabores que fazem parte da aventura
          </div>
          <p className="text-slate-400 text-base">
            Transforme sua visita ao Adventure World em uma experiência inesquecível. Descubra sabores incríveis e reserve seu lugar nos restaurantes do parque.
          </p>
        </div>

        <ReservationForm />
      </main>

      {/* Rodapé */}
      <footer className="py-8 text-center text-slate-500 text-xs border-t border-slate-900 bg-[#0b1021]/40">
        &copy; 2026 Adventure World Theme Park. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default App;