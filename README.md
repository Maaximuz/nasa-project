
# 🚀 NASA Explorer – Fullstack Challenge

Este é um projeto fullstack, utilizando a API da NASA para exibir e favoritar imagens astronômicas.

## 📁 Estrutura do Projeto

```
nasa-project/
├── backend/    # API REST em Nest.js com Prisma e autenticação JWT via cookies
└── frontend/   # Interface em Next.js + Tailwind para visualização e interação
```

---

## Fotos do sistema

![image](https://github.com/user-attachments/assets/c1bd9f52-3068-4a9c-bf80-e2e88542c98c)

![image](https://github.com/user-attachments/assets/5ab94325-1f2f-41a0-9907-2e52cc3b7e7c)

![image](https://github.com/user-attachments/assets/25bc682e-fe41-48d6-8b81-0baf9f0686bc)

![image](https://github.com/user-attachments/assets/d67e55e7-1007-4c04-a2c1-0dd0abc9bd17)

---

## ✅ Funcionalidades

- 📷 Exibição da imagem astronômica do dia (NASA APOD)
- 📅 Filtro por data com seletor interativo
- ⭐ Salvar imagens favoritas (autenticado)
- 🔐 Autenticação com JWT e Refresh Token via Cookies
- 📜 Histórico de imagens
- 🎨 Interface moderna e responsiva (dark theme incluso)

---

## 🧪 Tecnologias Utilizadas

### Frontend (Next.js)
- TypeScript
- Tailwind CSS
- React Datepicker
- Lucide Icons
- App Router
- Fetch com `credentials: include`

### Backend (Nest.js)
- TypeScript
- Prisma ORM
- SQLite (banco local)
- JWT + Cookies
- Guards + Estratégia JWT
- Modularização: Auth, Apod, Favorite

---

## ▶️ Como rodar localmente

### 🔧 Requisitos

- Node.js 18+
- npm ou yarn

### 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Maaximuz/nasa-project.git
cd nasa-project
```

2. Instale as dependências:

#### Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

#### Frontend:
```bash
cd ../frontend
npm install
npm run dev
```

---

### 🔐 Variáveis de Ambiente

Crie o arquivo `.env` no backend com:

```
JWT_SECRET=suachavesecreta
JWT_REFRESH_SECRET=suachaverefresh
NASA_API_KEY=DEMO_KEY
```
