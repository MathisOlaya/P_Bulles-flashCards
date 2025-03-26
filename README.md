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
   
   volumes: # Définit des volumes Docker qui permettent de stocker des données persistantes
     dbdata:
   ```
   

### 🚀 Plateforme
En premier temps j'ai choisi une plateforme me permettant d'héberger à la fois le site et la base de données. J'ai choisi Railway qui propose un essai gratuit.
