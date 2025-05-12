
# ✅ To-Do List App

Aplicação web de gerenciamento de tarefas com autenticação de usuários. O frontend foi desenvolvido em **React** com **Bootstrap**, enquanto o backend é uma API RESTful feita em **ASP.NET Core**, utilizando **Entity Framework** para acesso ao banco de dados e **JWT** para autenticação segura.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- React
- Bootstrap
- Axios
- React Router DOM

### 🛠️ Backend
- ASP.NET Core Web API
- Entity Framework Core
- PostGreSQL
- JWT (JSON Web Tokens)

---

## 📂 Estrutura do Projeto

```bash
To_Do_List/
├── To_Do_List.Server/       # Backend em ASP.NET Core
├── to_do_list.client/       # Frontend em React
├── To_Do_List.sln           # Solução do Visual Studio
└── README.md
```

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/)
- Banco de dados (PostGreSQL)

### 1. Clonar o repositório

```bash
git clone https://github.com/GabrielHertal/To_Do_List.git
cd To_Do_List
```

### 2. Configurar e iniciar o backend (API)

```bash
cd To_Do_List.Server
dotnet restore
dotnet ef database update
dotnet run
```

A API estará disponível em: `https://localhost:7202` ou `http://localhost:5029`

### 3. Iniciar o frontend (React)

```bash
cd to_do_list.client
npm install
npm start
```

A aplicação estará acessível em: `http://localhost:59644`

---

## ✅ Funcionalidades

- Cadastro e login de usuários
- Adicionar, editar e excluir tarefas
- Marcar tarefas como concluídas
- Listagem de quadros por usuário autenticado
- Listagem de tarefas Quadro
- Interface responsiva com React e Bootstrap

---

## 🗃️ Migrations (EF Core)

Para criar uma nova migration:
```bash
dotnet ef migrations add NomeDaMigration
```

Para atualizar o banco de dados:
```bash
dotnet ef database update
```

---

## 👨‍💻 Autor

**Gabriel Prigol Hertal**  
[GitHub](https://github.com/GabrielHertal)
