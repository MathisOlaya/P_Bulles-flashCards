# P_Bulles-flashCards
## 🐳 Déploiement avec Docker 
Pour déployer QuizConst, il a fallu suivre certaines étapes pour y parvenir. 

### 📦 Dockerisation
En premier temps, il est important de dockeriser toute son application. Cela permet d'empaqueter une application et toutes ses dépendances dans un conteneur, afin de pouvoir les déployer sur n'importe quel environnement. 

📁 Pour ce faire, il est important d'utiliser 2 fichiers (localement), le premier est *docker-compose.yml*. Celui-ci permet de définir et gérer les différents conteneurs. A noter que celui-ci est utile uniquement lors du développement en local, lorsque nous déployerons le tout en ligne, celui-ci ne sera pas utilisé. Et le second *Dockerfile*, celui-ci permet de crée une image Docker pour un seul service.
Ci-dessous se trouvera donc une explication détaillé de chacun de ces 2 fichiers.

1) Docker-compose.yml
   ```yml
   version: '2.1' # Définit la version du format du Docker Compose

   name: flashcards # Définit le nom du projet Docker
   
   services: # Définit les différents services (conteneurs Docker) que l'application utilise.
             # Au début nous utilisions également un service MySQL pour la base de données,
             # mais cela n'est plus nécessaire depuis que nous l'hébergeons en ligne 
    nodejs: # Définir le service nodejs dans lequel le code sera exécuté. (AdonisJS)
       build: # Définir la manière dont l'image sera construite dans le Dockerfile
         context: . # Indique le chemin de répertoire où se trouve le fichier DockerFile
         dockerfile: adonis.dockerfile # Indique le nom du fichier
       container_name: nodejs_passionlecture # Définit le nom du conteneur.
       ports: # Définit le port à exposer entre le conteneur et l'hôte
         - '3333:3333' # Ici 3333 & 3333
       restart: always # Permet de redémarre automatiquement si le cotneneur se termine. Cela permet d'avoir un conteneur toujours actif
       environment: # Définir chaque variables d'environnement nécessaire au bon fonctionnement de l'application
         - HOST=<host>
         - LOG_LEVEL=info
         - APP_KEY=<your-app-key>
         - PORT=<port>
         - SESSION_DRIVER=cookie
         - NODE_ENV=production
         - DB_HOST=<database-host>
         - DB_USER=<database-username>
         - DB_PASSWORD=<database-password>
         - DB_DATABASE=<database>
         - DB_PORT=<database-port>
       command: /bin/sh -c "node ace migration:run --force && node ./bin/server.js" # Commande s'exécutant au démarrage du conteneur (effectzer les migrations et lancer le serveur.)
   ```
2) adonis.dockerfile
   ```dockerfile
   FROM node:20.12.2 AS base # Indiquer que ce conteneur utilise une image node que nous renommons base.

   # All deps stage (Commentaire expliquant que la prochaine étape sera dédiée à l'installation des dépendances)
   FROM base AS deps # Redéfinition de base en 'deps'
   WORKDIR /app # Définit le répertoire de travail (donc toutes les prochaines commande seront exécutées dans /app)
   ADD package.json package-lock.json ./ # Ajouter les fichiers package*.json au répertoire du conteneur.
   RUN npm ci # Installer les dépendances (celles-ci sont définies dans package-lock.json)
   
   # Production only deps stage (Commentaire indiquant que la prochaine étape sera l'installation des dépendances spécifiques à la production)
   FROM base AS production-deps # Redéfintion de base en 'production-deps'
   WORKDIR /app # Redéfinit le répertoire de travail à /app
   ADD package.json package-lock.json ./ # Ajouter les fichiers package*.json au répertoire du conteneur
   RUN npm ci --omit=dev # Installer les dépendances nécessaires en exclusant les dépendances de développement (❌--save-dev)
   
   # Build stage (Commentaire indiquant que la prochaine étape est dédiée à la construction de l'application)
   FROM base AS build # Redéfinition de base en 'build'
   WORKDIR /app # Redéfinit le répertoire de travail à /app
   COPY --from=deps /app/node_modules /app/node_modules # Copie le répertoire /app/node_modules de l'étape deps dans l'étape build
   ADD . . # Copie tous les fichiers du répertoire local dans /app
   RUN node ace build # Exécute la commande pour construire l'application AdonisJS
   
   # Production stage (Commentaire indiquant que la prochaine étape est dédiée à la production)
   FROM base # Créer une nouvelle image à partir de 'base'
   ENV NODE_ENV=production # Définit la variable d'environnement NODE_ENV en 'production'. Cela permet à l'application de s'exécuter dans un mode de production optimisé.
   WORKDIR /app # Définit à nouveau le répertoire de travail à /app
   COPY --from=production-deps /app/node_modules /app/node_modules # Copie les dépendances de production installées à l'étape 'production-deps'
   COPY --from=build /app/build /app # Copie le répertoire /app/build dans /app
   EXPOSE 3333 # Expose le port 3333, indiquant le port d'écoute de l'application.
   CMD ["node", "./bin/server.js"] # Permet de lancer le serveur se trouvant dans le répertoire bin
   ```
   

### 🚀 Plateforme
En suite j'ai choisi une plateforme me permettant d'héberger à la fois le site et la base de données. J'ai choisi Railway qui propose un essai gratuit.

### 📊 Hébergement de la base de données
Pour cette étape, il suffit simplement d'ajouter un nouveau service MySQL, et d'y copier les variables d'environnement fournies par le service dans notre code. Puis importer les tables avec la commande : 
   ```ace
   node ace migration:run
   ```

✅ La base de données est maintenant accessible en ligne depuis notre application (même en local)

### Hébergement de l'application
Il reste maintenant à ajouter un service en spécifiant notre repos GitHub. Puis ajouter les variables d'environnement de notre application. Il faut également ajouté la variable *railway_dockerfile_path* qui permet de définir la position de notre fichier Dockerfile.
   ```env
   RAILWAY_DOCKERFILE_PATH="/path/to/your/dockerfile"
   ```
Et finir, en activant le nom de domaine.
### 🎉 Notre application est maintenant dockerisée et disponible en ligne

## Déploiement de l'application sur un serveur distant
 
### 1. Transférer l'application sur le serveur distant
```bash
scp -r -P 222 <nom-dossier/fichier> <utilisateur>@<nom-domaine>:~/<chemin-depuis-la-racine>
```
-   `scp`: Outil pour copier des fichiers entre 2 machines distantes
-   `-r`: Copie même les sous-fichiers
-   `-P`: `222` Spécifie le port du serveur
-   `<nom-dossier/fichier>`: Nom du dossier que l'on veut copier
-   `<utilisateur>@<nom-domaine>`: Nom d'utilisateur et domaine pour se connecter a la machine distante
-   `~`: Symbole qui indique que c'est la racine
-   `<chemin-depuis-la-racine>`: Chemin ou l'on veut transférer les fichiers
 
### 2. Se connecter au serveur distant
```bash
ssh -p 222<utilisateur>@<nom-domaine>
```
 
-   `ssh`: Outil pour se connecter à une machine distante
-   `-p`: `222` Spécifie le port du serveur
-   `<utilisateur>@<nom-domaine>`: Nom d'utilisateur et domaine pour se connecter a la machine distante
- Mettre le mot de passe

### 3. Construire l'application
```bash
node ace build
```

### 4. Modifier les variables d'environnements
```bash
cp .env /build/.env
```

-   `cp`: Outil permettant de copier
-   `.env`: Fichier que nous souhaitons copier
-   `/build/.env`: Destination de la copie

#### Optionnel : Modifier les variables 
```bash
nano /build/.env
```
-   `nano`: Editeur de texte
-   `build/.env`: Fichier à modifier

### 5. Installer pm2
```bash
npm install pm2@latest -g
```

-   `npm`: Gestionnaire de packages
-   `install`: Installeur de packages
-   `pm2`: Packet à installer
-   `@latest`: Préciser la version la plus récente
-   `-g`: Installer le module globalement dans npm

### 6. Lancer
```bash
pm2 start build/server.js --name flashcards
```
