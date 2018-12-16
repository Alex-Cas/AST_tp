# Asynchronous Server Technologies TPs
Les différents TPs sont une introduction aux technologies liées aux serveurs avec le langage JavaScript, et une panoplie de librairies comme Express, Typescript, Mocha, LevelDB ...

## Présentation
Le serveur expose plusieurs pages accessibles depuis l'adresse suivante: 
```
1. localhost:8080/
```

Pour un quickstart du serveur, les commandes sont les suivantes
```
npm run populate
npm start
```
Cela va créer deux utilisateurs : Alexandre et Jean, avec comme mots de passe 'alex' et 'secret' respectivement.

## Utilisation

### Pages d'auth
Le page login à l'adresse /login va servir à la connexion et contient un lien vers une page de création de compte.
La page de création de compte est à l'adresse /signup.

### Page metrics
La page metrics à l'adresse /metrics va afficher les différentes metrics de l'utilisateur actuellement connecté.
Nous pouvons ajouter et supprimer une metric à l'aide de boutons.
Le bas de la page contient un graphique représentant les metrics.

L'accès à cette page est bloqué si l'utilisateur n'est pas connecté

### Page user
La page user est à l'adresse /user/:username et va afficher l'utilisateur concerné sous forme de JSON.

### Pages non trouvées
Une url qui n'est pas repertoriée renverra une message d'erreur 404.


## Auteur
Alexandre CASARA.


