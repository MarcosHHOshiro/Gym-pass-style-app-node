# 🚀 Guia de Deploy - VPS com Docker

## Pré-requisitos na VPS

1. Docker e Docker Compose instalados
2. Git instalado
3. Portas 80, 443 e 3333 liberadas no firewall

## 📦 Instalação Rápida

### 1. Instalar Docker na VPS

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | bash

# Iniciar Docker
systemctl start docker
systemctl enable docker

# Instalar Git
apt install git -y
```

### 2. Clonar o Projeto

```bash
cd /var/www
git clone https://github.com/MarcosHHOshiro/Gym-pass-style-app-node.git
cd Gym-pass-style-app-node
```

### 3. Criar arquivo .env

```bash
nano .env
```

Cole o seguinte conteúdo (substitua os valores):

```env
NODE_ENV=production
PORT=3333
JWT_SECRET=TROQUE-POR-UMA-CHAVE-MUITO-SEGURA-E-ALEATORIA
DB_PASSWORD=docker
DATABASE_URL=postgresql://docker:docker@db:5432/apisolid?schema=public
```

**⚠️ IMPORTANTE:** Gere uma chave JWT forte, por exemplo:
```bash
openssl rand -base64 32
```

### 4. Deploy

**Opção A - Script automatizado:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Opção B - Manual com Nginx:**
```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

**Opção C - Deploy simples (sem Nginx):**
```bash
docker compose up -d --build
```

## 🔄 Atualizações

Para atualizar a aplicação após fazer alterações no código:

```bash
cd /var/www/Gym-pass-style-app-node
./deploy.sh
```

Ou manualmente:
```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

## 📊 Comandos Úteis

```bash
# Ver logs
docker compose logs -f api

# Status dos containers
docker compose ps

# Parar aplicação
docker compose down

# Reiniciar apenas a API
docker compose restart api

# Backup do banco
docker compose exec db pg_dump -U docker apisolid > backup_$(date +%Y%m%d).sql

# Acessar o container
docker compose exec api sh
```

## 🔒 Configurar SSL (HTTPS)

```bash
# Instalar Certbot
apt install certbot -y

# Parar Nginx temporariamente
docker compose -f docker-compose.prod.yml stop nginx

# Obter certificado SSL
certbot certonly --standalone -d seu-dominio.com

# Editar docker-compose.prod.yml para adicionar volumes SSL
# Editar nginx/nginx.conf para configurar HTTPS

# Reiniciar
docker compose -f docker-compose.prod.yml up -d
```

## 🌐 Acessar a Aplicação

- **API:** http://seu-ip-ou-dominio
- **Documentação Swagger:** http://seu-ip-ou-dominio/docs
- **Health Check:** http://seu-ip-ou-dominio/health (se configurado)

## 🐛 Troubleshooting

### Container não inicia
```bash
docker compose logs api
```

### Banco de dados não conecta
```bash
docker compose logs db
```

### Limpar tudo e recomeçar
```bash
docker compose down -v
docker compose up -d --build
```

## 📁 Estrutura de Arquivos

```
/var/www/Gym-pass-style-app-node/
├── .env                      # Variáveis de ambiente (não commitado)
├── docker-compose.yml        # Deploy simples
├── docker-compose.prod.yml   # Deploy com Nginx
├── deploy.sh                 # Script de deploy automatizado
└── nginx/
    └── nginx.conf           # Configuração do Nginx
```

## 🔐 Segurança

1. **NUNCA** commite o arquivo `.env`
2. Use senhas fortes para `JWT_SECRET`
3. Configure o firewall (`ufw`)
4. Use HTTPS em produção
5. Mantenha o Docker atualizado
6. Faça backups regulares do banco de dados

## 📈 Monitoramento

### Instalar Portainer (Interface Web)
```bash
docker run -d -p 9000:9000 --name portainer \
  --restart always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Acesse: http://seu-ip:9000
