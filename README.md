# ThemePark Dining

Aplicação full-stack para consultar restaurantes e tipos de mesa e fazer reservas em restaurantes de um parque temático. A interface React comunica com uma API REST em Django, que persiste os dados e valida a capacidade e a disponibilidade das mesas.

## Arquitetura

```text
Navegador
   │
   ▼
Frontend React + TypeScript + Vite
   │  HTTPS / REST (Axios)
   ▼
API Django + Django REST Framework
   │
   ▼
SQLite (desenvolvimento) ou PostgreSQL (DATABASE_URL)
```

O arquivo `vercel.json` configura o deploy do backend como função Python na Vercel. O frontend é um projeto Vite separado, na pasta `frontend`, e pode ser publicado separadamente. A aplicação aceita uma URL de API configurada pelo frontend; o provedor de PostgreSQL é definido pela `DATABASE_URL`.

## Tecnologias

### Backend

- Python 3.12 no runtime configurado para a Vercel
- Django 6.1 e Django REST Framework
- Django ORM e migrations
- SQLite local ou PostgreSQL via `DATABASE_URL`
- WhiteNoise para arquivos estáticos
- Gunicorn como servidor WSGI

### Frontend

- React 19 e TypeScript
- Vite
- Axios
- Tailwind CSS e Lucide React

## Funcionalidades

- Listagem de restaurantes e tipos de mesa pela API.
- Formulário de reserva com nome, e-mail, restaurante, mesa, data/hora e número de convidados.
- Validação para impedir grupos maiores que a capacidade da mesa.
- Validação de disponibilidade: a API conta reservas da mesma mesa dentro de uma janela de 1 hora e 59 minutos antes e depois do horário solicitado, comparando o total com a quantidade de mesas daquele tipo.
- Interface responsiva para o fluxo de reserva.

## Estrutura do projeto

```text
.
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── theme_park/          # Configurações e rotas Django
│   └── reservations/        # Modelos, serializers, API e testes
├── frontend/
│   ├── package.json
│   └── src/                 # Aplicação React
└── vercel.json              # Configuração de deploy do backend
```

## Executar localmente

### 1. Backend

Requer Python 3.12 ou compatível com a versão do Django declarada em `backend/requirements.txt`.

No PowerShell, a partir da raiz do repositório:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
Set-Location backend
python manage.py migrate
python manage.py runserver
```

A API ficará disponível em `http://localhost:8000`. Sem `DATABASE_URL`, o backend usa SQLite em `backend/db.sqlite3`.

### 2. Frontend

Em outro terminal, a partir da raiz do repositório:

```powershell
Set-Location frontend
npm install
npm run dev
```

O Vite exibirá o endereço local da interface no terminal. Por padrão, o frontend chama `http://localhost:8000`. Para usar outra instância da API, crie `frontend/.env.local`:

```dotenv
VITE_API_URL=https://endereco-da-api
```

O valor deve ser a origem da API, sem acrescentar `/api` ao final.

## Variáveis de ambiente

Configure as variáveis no ambiente em que o backend será executado:

| Variável | Uso |
| --- | --- |
| `SECRET_KEY` | Chave secreta do Django. Defina uma chave forte fora do desenvolvimento local. |
| `DEBUG` | Modo de depuração; use `False` em produção. |
| `DATABASE_URL` | URL de conexão PostgreSQL. Se não estiver definida, é usado SQLite. |

Para o frontend, configure `VITE_API_URL` com a origem pública do backend. Não coloque segredos no frontend: variáveis `VITE_*` são incorporadas ao bundle público.

## API

As rotas são disponibilizadas pelo router REST em `/api/`:

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/api/restaurants/` | Lista restaurantes |
| `GET` | `/api/restaurants/{id}/` | Consulta um restaurante |
| `GET` | `/api/tables/` | Lista tipos de mesa |
| `GET` | `/api/tables/{id}/` | Consulta um tipo de mesa |
| `GET`, `POST` | `/api/reservations/` | Lista ou cria reservas |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/api/reservations/{id}/` | Consulta, atualiza ou exclui uma reserva |
| `GET` | `/api/` | Índice navegável da API REST |
| `GET` | `/admin/` | Painel administrativo do Django |

Uma reserva recebe `guest_name`, `guest_email`, `restaurant`, `table`, `visit_datetime` e `number_of_guests`. Os campos `restaurant` e `table` usam os identificadores dos registros relacionados.

## Dados e modelos

- **Restaurant**: nome e zona do parque. A combinação de nome e zona é única.
- **Table**: restaurante, capacidade por mesa e quantidade disponível daquele tipo.
- **Reservation**: dados do cliente, restaurante, mesa, data/hora da visita e número de convidados.

O comando `import_restaurants` importa restaurantes e mesas de um arquivo `restaurants.csv` no diretório de trabalho, com as colunas `restaurant_name`, `location`, `table_size` e `table_count`. Para executá-lo, coloque o CSV em `backend` e rode:

```powershell
python manage.py import_restaurants
```

## Testes e validações

Os testes do backend verificam a criação de reservas válidas, o limite de capacidade e a prevenção de overbooking:

```powershell
Set-Location backend
python manage.py test reservations
```

Para verificar o frontend:

```powershell
Set-Location frontend
npm run lint
npm run build
```

## Deploy

- **Backend:** a configuração em `vercel.json` publica `backend/theme_park/wsgi.py` como função Python na Vercel. Defina `SECRET_KEY`, `DEBUG=False` e `DATABASE_URL` no ambiente de produção.
- **Frontend:** publique a pasta `frontend` como aplicação Vite e configure `VITE_API_URL` com o endereço público do backend.
- **CORS:** o backend permite atualmente origens cruzadas. Em produção, restrinja as origens às URLs do frontend antes de disponibilizar a API publicamente.

Execute as migrations no banco de dados de produção antes de usar a aplicação:

```powershell
python manage.py migrate
```
