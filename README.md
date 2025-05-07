# P_Bulles-flashCards | QuizConst 📖
## 🔧 Technologies utilisées 
![AdonisJS](https://img.shields.io/badge/AdonisJS-5E2B97?style=for-the-badge&logo=adonisjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Bash](https://img.shields.io/badge/Bash-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-000000?style=for-the-badge&logo=railway&logoColor=white)

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
   RUN npm ci --omit=dev # Installer les dépendances nécessaires en exclusant les dépendances de développement
   
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
En suite j'ai choisi une plateforme me permettant d'héberger à la fois le site et la base de données. J'ai choisi Railway qui propose un essai gratuit. Il faut donc créer un compte, et y ajouter un nouveau projet <a href="railway.com/dashboard">(voir ici)<a/>

### 📥 Ajouter le repos
En suite, connectez votre comptre GitHub pour sélectionner le repos souhaité. Pour ma part "MathisOlaya/P_Bulles-flashCards". Attendez un instant le temps que railway copie le repos.

### ⚠️ Important : Référencez le dockerfile / projet
Railway a maintenant besoin du dockerfile créer précédemment, si celui-ci se trouve à la racine de votre repos alors tout est bon. Cependant, pour ma part il se trouve dans un sous-dossier, sinon il faut le référencer. Pour ce faire, aller dans `Variables` et cliquer sur `New Variable` pour en ajouter une.  Et initialiser la ainsi :

```js
VARIABLE_NAME: RAILWAY_DOCKERFILE_PATH
VALUE or ${{REF}}: *votre_chemin_daccess_depuis_la_racine* // Par exemple : /flashCards/adonis.dockerfile
```

De même pour le dossier contenant le code, pour le référencer, allez dans `Settings`, puis `Add Root Directory` et ajouter y le dossier souhaité. 
Pour ma part `/flashcards`


### 📊 Hébergement de la base de données
Il faut maintenant déployer la base de données pour la rendre accessible depuis n'importe où.
Pour ce faire, retournez sur `Railway`, et ajouter un nouveau service (*clique droit dans le fond*) et sélectionnez `Database`. Puis sélectionner `MySQL`. Attendez le temps que Railway initialisent la base de données. 

### 🔐 Ajouter les variables d'environnents
Pour que notre application fonctionne correctement, elle a besoin d'utiliser certaines variables d'environnements. Pour ce faire, rendez-vous à nouveau dans le service contenant l'appliction, puis dans `Variables`. Il va falloir définir/coller une série de variables, pour ce faire je vous 
conseille d'utiliser le `Raw Editor` en mode `ENV`. Voici la liste exhaustive à définir pour ce projet (⚠️ Cette liste peut changée en fonction du projet)

La première variable est APP_KEY, pour la générer, ouvrez un CMD et exécuter : 

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
🖍️ Copier la valeur retournée et collez la dans APP_KEY :

```env
RAILWAY_DOCKERFILE_PATH="/flashCards/adonis.dockerfile"
APP_KEY="collez_votre_cle_ici"
HOST="0.0.0.0"
LOG_LEVEL="info"
SESSION_DRIVER="cookie"
DB_HOST="{{MySQL.RAILWAY_TCP_PROXY_HOST}}"
DB_PORT="{{MySQL.RAILWAY_TCP_PROXY_PORT}}"
DB_USER="{{MySQL.MYSQLUSER}}"
DB_PASSWORD="{{MySQL.MYSQLPASSWORD}}"
DB_DATABASE="{{MySQL.MYSQLDATABASE}}"
```
⚠️ Certaines variables commencent par `MySQL`, vérifier bien que cette valeur correspond au nom du service contenant votre base de données.

Dernière étape, notre base de données est vide pour le moment. Il est important d'importer les tables nécessaires au bon fonctionnement de l'application. Il est uniquement possible de faire cela depuis votre PC, donc assurez vous d'avoir le repos en local et d'y avoir installer les dépendances (`npm i`). Ouvrez le dossier contenant votre projet, en l'occurence AdonisJS. Ouvrez le fichier `.env` et copier y toutes les variables qu'on vient de définir dans Railway (⚠️ Pensez bien à remplacer {{MySQL.NOM_DE_LA_VARIABLE}} par la valeur réel), ajoutez également ces deux variables : 

```env
PORT=3000
NODE_ENV=production
```

*Avant d'exécuter la commande, assurez vous que le service MySQL est prêt, pour savoir, ouvrez-le et rendez-vous dans l'onglet `Data`. Vous pourrez voir ici si le service est prêt.*
Ouvrez ensuite un CMD et exécuter la commande :

```ace
node ace migration:run
```

✅ La base de données est maintenant accessible en ligne et contient toutes les tables nécessaires.

### 🏁 Déployer
Vous pouvez maintenant déployer vos applications en ligne. Vous pouvez maintenant vous rendre sur votre site grâce à l'url publique, pour le trouver/créer, ouvrez votre service contenant votre application, rendez-vous dans `Settings`. Descendez jusqu'à `Networking` et cliquez sur `Generate Custom Domain`. Une adresse se créera. Pour ma part : 

<a href="pbulles-flashcards-production-c623.up.railway.app">pbulles-flashcards-production-c623.up.railway.app</a> Non fonctionnel

## Déploiement de l'application sur un serveur distant
 
### 1. Transférer l'application sur le serveur distant
Avant toute chose, supprimer le dossier `node_modules` de votre répertoire contenant le projet, cela facilitera le transfert. Il ne faudra toute fois pas oublier de le retélécharger par la suite.

Conseil : Ouvrez un BASH à la racine de votre projet, ou un niveau au dessus pour simplifier l'écriture de la commande ci-dessous.
```bash
scp -r -P 222 <"./nom-dossier"> <utilisateur>@<nom-domaine>:~/<chemin-depuis-la-racine>
```
-   `scp`: Outil pour copier des fichiers entre 2 machines distantes
-   `-r`: Copie même les sous-fichiers
-   `-P`: `222` Spécifie le port du serveur
-   `<nom-dossier>`: Nom du dossier que l'on veut copier ⚠️ Il est important d'entourer le chemin par des guillemets et de le précéder par un `./`, sinon tous les fichiers pourraient ne pas être transférés. 
-   `<utilisateur>@<nom-domaine>`: Nom d'utilisateur et domaine pour se connecter a la machine distante
-   `~`: Symbole qui indique que c'est la racine
-   `<chemin-depuis-la-racine>`: Chemin ou l'on veut transférer les fichiers

Pour ma part : 
```bash
scp -r -P 222 "./" mathis@mid2a-mathis.w3.pm2etml.ch:~/my-app
```
📍 Je me suis mis dans mon dossier contenant tout le code, d'ou le `./`
📁Le dossier `my-app` sera créer tout seul, pas d'inquiétude

### 2. Se connecter au serveur distant
```bash
ssh -p 222 <utilisateur>@<nom-domaine>
```
 
-   `ssh`: Outil pour se connecter à une machine distante
-   `-p`: `222` Spécifie le port du serveur
-   `<utilisateur>@<nom-domaine>`: Nom d'utilisateur et domaine pour se connecter a la machine distante
- Mettre le mot de passe

Vous pouvez vérifier avec la commande `ls` que votre dossier est bien présent. 

### 3. Construire l'application
Il est temps de construire l'application, pour ce faire rendez-vous dans le répertoire contenant votre code avec la commande : `cd my-app`

⚠️ Si vous aviez supprimer le dossier node_modules, ré-installer le maintenant avec la commande : 
```bash
npm i
```

Puis

```bash
node ace build
```

### 4. Modifier les variables d'environnements
```bash
cp .env build/.env
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

### 5. Installer les dépendances
Se rendre dans le dossier de build 

```bash
cd build/
```
Puis installer les dépendances uniquement nécessaires à la production avec la commande : 

```bash
npm ci --omit="dev"
```

### 6. Installer pm2
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
