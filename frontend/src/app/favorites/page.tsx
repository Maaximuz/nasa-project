'use client';

import { useEffect, useState } from 'react';

type Favorite = {
  id: number;
  title: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const fetchFavorites = async () => {
    const res = await fetch('http://localhost:3001/favorite', {
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      setFavorites(data);
    } else if (res.status === 401) {
      console.warn('Access token expirado, tentando renovar...');
      const refreshed = await fetch('http://localhost:3001/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshed.ok) {
        console.log('Token renovado com sucesso!');
        return fetchFavorites();
      } else {
        console.error('Erro ao renovar token');
      }
    } else {
      const text = await res.text();
      console.error('Erro ao buscar favoritos:', text);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
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

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400">Nenhuma imagem favoritada ainda.</p>
      ) : (
        <div className="overflow-x-auto whitespace-nowrap flex gap-6 px-2">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="min-w-[300px] max-w-[320px] bg-black/70 backdrop-blur rounded-xl p-4 flex flex-col shadow-md"
            >
              <div className="h-48 w-full overflow-hidden rounded mb-4">
                <img
                  src={fav.imageUrl}
                  alt={fav.title}
                  className="object-cover h-full w-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{fav.title}</h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-3">{fav.description || 'Sem descrição'}</p>
              <p className="text-xs text-gray-400 mt-auto">
                Favoritado em: {new Date(fav.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
