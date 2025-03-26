# P_Bulles-flashCards
## 🐳 Déploiement avec Docker 
Pour déployer QuizConst, il a fallu suivre certaines étapes pour y parvenir. 

### 📦 Dockerisation
En premier temps, il est important de dockeriser toute son application. Cela permet d'empaqueter une application et toutes ses dépendances dans un conteneur, afin de pouvoir les déployer sur n'importe quel environnement. 

📁 Pour ce faire, il est important d'utiliser 2 fichiers, le premier est *docker-compose.yml*. Celui-ci permet de définir et gérer les différents conteneurs. Et le second *Dockerfile*, celui-ci permet de crée une image Docker pour un seul service.
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
         - HOST=0.0.0.0
         - LOG_LEVEL=info
         - APP_KEY=KKOPY4l340863b43R3E2w6jKxQY-jS2o
         - PORT=3333
         - SESSION_DRIVER=cookie
         - NODE_ENV=production
         - DB_HOST=switchyard.proxy.rlwy.net
         - DB_USER=root
         - DB_PASSWORD=kTyQuNFnrtSAxbNUYMHyWNAIuqlxtTJF
         - DB_DATABASE=railway
         - DB_PORT=53315
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
En premier temps j'ai choisi une plateforme me permettant d'héberger à la fois le site et la base de données. J'ai choisi Railway qui propose un essai gratuit.
