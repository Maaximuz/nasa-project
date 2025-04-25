"use client";

import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";

type ApodData = {
  title: string;
  explanation: string;
  url: string;
  date?: string;
};

export default function LandingPage() {
  const getTodayDate = () => {
    const localDate = new Date();
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toISOString().split("T")[0];
  };

  const [loading, setLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [photoOfTheDay, setPhotoOfTheDay] = useState<ApodData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleFavorite = async () => {
    if (!photoOfTheDay) return;
  
    try {
      const res = await fetch('http://localhost:3001/favorite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: photoOfTheDay.title,
          description: photoOfTheDay.explanation,
          imageUrl: photoOfTheDay.url,
        }),
      });
  
      if (res.ok) {
        setIsFavorited(true);
      } else {
        console.error('Erro ao favoritar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  fetch('http://localhost:3001/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => {
      if (res.ok) setIsAuthenticated(true);
      else setIsAuthenticated(false);
    })
    .catch(() => setIsAuthenticated(false));
}, []);

  useEffect(() => {
  if (!selectedDate) return;

  setLoading(true);
  fetch(`http://localhost:3001/apod?date=${selectedDate}`)
    .then((res) => res.json())
    .then(setPhotoOfTheDay)
    .finally(() => setLoading(false));
}, [selectedDate]);

  const [gallery, setGallery] = useState<ApodData[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/apod/history")
      .then((res) => res.json())
      .then(setGallery);
  }, []);

  return (
    <main className="relative text-white font-sans min-h-screen overflow-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 border-b border-gray-800 flex justify-between items-center px-8 py-4 uppercase tracking-wide text-sm">
        <h1 className="text-xl font-bold">NASA Explorer</h1>
        <div className="flex gap-6">
          <a href="/" className="hover:underline">Início</a>

          {isAuthenticated ? (
            <div className="flex gap-6">
            <a href="/favorites" className="hover:underline">
              Favoritos
            </a>
            <a
              onClick={async () => {
                await fetch('http://localhost:3001/auth/logout', {
                  method: 'POST',
                  credentials: 'include',
                });
                window.location.href = '/';
              }}
              className="hover:underline cursor-pointer"
            >
              Sair
            </a>
          </div>
          ) : (
            <a href="/login" className="hover:underline">
              Entrar
            </a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 pt-32 px-8 md:px-20 overflow-hidden"
        style={{ backgroundImage: "url('/galaxia.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="relative z-10 md:w-1/2 space-y-6 text-white bg-black/50 p-6 rounded-lg backdrop-blur-sm">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight uppercase tracking-wider">
            Explore o universo
          </h2>
          <p className="text-gray-100 text-lg md:text-xl">
            Acompanhe a imagem astronômica do dia diretamente da NASA, favorite suas descobertas e mergulhe no cosmos.
          </p>
          <a
            href="#galeria"
            className="inline-flex items-center gap-2 border border-white px-6 py-3 rounded hover:bg-white hover:text-black transition-all uppercase text-sm font-medium"
          >
            Ver foto do dia
          </a>
        </div>
      </section>

      {/* Seções de recursos */}
      <section id="sobre" className="py-24 px-6 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-left">
          <div className="border-l-4 pl-6 border-white">
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-2">🔭 Buscar por Data</h3>
            <p className="text-gray-400 text-sm">Selecione qualquer data e veja a imagem registrada pela NASA naquele dia. É uma viagem no tempo cósmico.</p>
          </div>
          <div className="border-l-4 pl-6 border-white">
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-2">⭐ Salvar Favoritos</h3>
            <p className="text-gray-400 text-sm">Marque suas imagens preferidas e acesse rapidamente o que mais chamou sua atenção no universo.</p>
          </div>
          <div className="border-l-4 pl-6 border-white">
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-2">📚 Histórico Visual</h3>
            <p className="text-gray-400 text-sm">Visualize todas as imagens que você já explorou, organizadas cronologicamente. Um verdadeiro diário espacial.</p>
          </div>
        </div>
      </section>

      {/* Galeria de Imagens do Dia */}
      <section id="galeria" className="relative mt-20 px-6">
      <h2 className="text-3xl font-bold uppercase tracking-wide text-white mb-6">
        Imagem do Dia
      </h2>

      {/* Botão flutuante */}
      <div className="absolute right-0 top-0 z-10 flex">
        {loading && (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        )}
        <DatePicker
          selected={new Date(selectedDate)}
          onChange={(date) => {
            if (date) {
              const iso = date.toISOString().split("T")[0];
              setSelectedDate(iso);
            }
          }}
        
          dateFormat="dd/MM/yyyy"
          locale={ptBR}
          className="bg-transparent text-white outline-none cursor-pointer"
          popperPlacement="bottom-end"
        />
      </div>

      {/* Resultado da busca */}
      {photoOfTheDay && (
        <div className="mt-10 flex flex-col md:flex-row bg-black/70 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="md:w-[40%] p-6 text-white flex flex-col justify-start">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold uppercase">{photoOfTheDay.title}</h3>
            <button
              onClick={handleFavorite}
              disabled={isFavorited}
              className={`p-2 rounded-full border transition ${
                isFavorited ? 'bg-yellow-400 text-black' : 'bg-white text-black hover:bg-yellow-200'
              }`}
              title="Favoritar"
            >
              <Star className="w-5 h-5" fill={isFavorited ? '#facc15' : 'none'} />
            </button>
          </div>
            <p className="text-sm text-gray-300">{photoOfTheDay.explanation}</p>
          </div>
      
          <div className="md:w-[60%] h-165 flex items-center justify-center bg-black">
            <img
              src={photoOfTheDay.url}
              alt={photoOfTheDay.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>

      {/* Rodapé */}
      <footer className="bg-black text-center py-10 border-t border-gray-800 text-sm text-gray-500">
        <p>Dados fornecidos pela <a href="https://api.nasa.gov/" className="underline hover:text-white">API da NASA</a></p>
      </footer>
    </main>
  );
}
