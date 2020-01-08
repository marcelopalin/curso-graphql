# 1. DUMP DO BD - FORMA COMPLEXA


```bash
mysqldump -u root -p -c -e --default-character-set=utf8 --single-transaction --skip-set-charset --add-drop-database -B projeto-final > projeto-final.sql
```

# 2. DUMP DO BD FORMA SIMPLES

```bash
mysqldump -u root -p projeto-final > projeto-final.sql
```

# 3. RESTAURANDO BD 
```
mysql -u root -p --default-character-set=utf8 projeto-final < projeto-final.sql
```


## 3.4. NOME DO BD E SENHA DO BD
BD treinamento_db;
User: admin_api
Pass: senha123


```bash
CREATE DATABASE projeto-final CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'projeto-final'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'projeto-final'@'localhost';
CREATE USER 'projeto-final'@'%' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'projeto-final'@'%';
flush privileges;
quit;
```

