# Инструкции по настройке CI/CD

### Настройка GitHub Secrets:

1. **SERVER_HOST** - IP адрес сервера
2. **SERVER_USERNAME** - имя пользователя
3. **SERVER_SSH_KEY** - SSH ключ
4. **SERVER_PORT** - порт (обычно 22)
5. **DOMAIN_NAME** - доменное имя в Nginx

### Установка заивисимостей на сервере 

```bash

# Установка .NET 9.0
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-9.0

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

sudo apt install -y nginx

sudo apt install -y postgresql postgresql-contrib
```

### Настройка пользователей:

```bash
sudo useradd -m -s /bin/bash webproject
sudo usermod -aG sudo webproject

sudo mkdir -p /home/webproject/.ssh
sudo chown webproject:webproject /home/webproject/.ssh
sudo chmod 700 /home/webproject/.ssh
```

## Настройка базы данных

```bash
sudo -u postgres psql
CREATE DATABASE choosy;
CREATE USER choosy_user WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE choosy TO choosy_user;
\q
```

### Переменные окружения

```bash
sudo nano /var/www/webproject/backend/appsettings.Production.json
```
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=choosy;Username=choosy_user;Password=admin"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```