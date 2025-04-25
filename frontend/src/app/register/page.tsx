'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/favorites');
    } else {
      const data = await res.json();
      setError(data.message || 'Erro ao cadastrar');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white max-w-md w-full p-8 rounded shadow space-y-6"
      >
        <h1 className="text-2xl text-black font-bold uppercase text-center">Criar conta</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded text-black"
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:opacity-80 transition"
        >
          Registrar
        </button>
      </form>
    </main>
  );
}
