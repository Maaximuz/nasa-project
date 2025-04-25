import { useEffect, useState } from "react";

type ApodData = {
  title: string;
  explanation: string;
  url: string;
};

export default function Home() {
  const [data, setData] = useState<ApodData | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/apod") // backend rodando em 3001
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="text-center mt-10">Carregando...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <img src={data.url} alt={data.title} className="rounded shadow mb-4" />
      <p>{data.explanation}</p>
    </div>
  );
}
