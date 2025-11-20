
---

# 📘 **README 2 – BACKEND (API)**  
📍 Repositório: https://github.com/Michael-Botelho-Dev/EvolvAI-Backend  

---

## **README.md – BACKEND**

```md
# Evolv.AI – Backend  
API REST responsável pela lógica de negócio do Evolv.AI, incluindo trilhas, missões, progresso, autenticação e integração com IA.

---

## 🎯 Objetivo
O backend realiza:
- autenticação e criação de usuários;
- registro de progresso e missões;
- cálculo de XP e níveis;
- entrega de trilhas e recomendações;
- conexão direta com o módulo de IA (Python);
- suporte ao frontend oficial do projeto.

---

## 🧱 Arquitetura
Fluxo backend:

`Frontend → Backend → IA (ML) → Backend → Frontend`

Módulos:
- `/auth`
- `/users`
- `/missions`
- `/tracks`
- `/insights`
- `/ai`

---

## 🛠 Tecnologias Utilizadas
- Node.js  
- Express.js  
- Nodemon  
- JWT  
- Dotenv  
- Axios  

---

## ▶️ Como Rodar o Backend

### 1. Clone o repositório
```bash
git clone https://github.com/Michael-Botelho-Dev/EvolvAI-Backend
cd EvolvAI-Backend
