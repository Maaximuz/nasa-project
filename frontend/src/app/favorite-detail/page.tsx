"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function FavoriteDetailPage() {
  const [favorite, setFavorite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/favorite/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFavorite(data);
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-20 py-10">
      <a
        href="/favorites"
        className="inline-flex items-center gap-2 mb-10 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar aos favoritos
      </a>

      {loading ? (
        <p className="text-center text-gray-400">Carregando imagem...</p>
      ) : favorite ? (
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold uppercase tracking-wider leading-tight">
              {favorite.title}
            </h1>
            <p className="text-gray-400 text-sm">
              Favoritado em: {new Date(favorite.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-300 text-justify leading-relaxed text-base">
              {favorite.description || "Sem descrição fornecida."}
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src={favorite.imageUrl}
              alt={favorite.title}
              className="w-full rounded-lg shadow-xl object-cover max-h-[600px]"
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-red-400">Imagem não encontrada.</p>
      )}
    </main>
  );
}
