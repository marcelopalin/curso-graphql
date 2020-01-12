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
User: admin_grapql
Pass: senha123



```bash
CREATE DATABASE projgrapqlbd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'admin_grapql'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'localhost';
CREATE USER 'admin_grapql'@'%' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON *.* TO 'admin_grapql'@'%';
flush privileges;
quit;
```

