# Asynchronous Server Technologies TPs
Le serveur est une introduction aux routes, Express, ejs et à NodeJS

## Présentation
Nous pouvons accéder à 2 pages distinctes avec 2 urls :

```
1. localhost:8080/
2. localhost:8080/hello/xxx
```

Lancer le serveur avec la commande :

```
node .\index.js
```

## Utilisation

### Page *Home*
La page *Home* (url 1.) est une introduction du site avec différentes instructions.

### Pages *Hello*
La page *Hello* (url 2.) renvoie un message de bienvenue contenant le nom de la personne entrée en paramètres dans l'url (remplacer 'xxx' par son nom).

Une page spéciale est renvoyée lorsque le nom entré en paramètre est **Alexandre**.

### Pages non trouvées
Une url qui n'est pas repertoriée ci-dessus renverra une message d'erreur 404.


## Auteur
Alexandre CASARA.



## Note : tp3
Le tp a été basé (par mégarde) sur les anciennes instructions qui demandaient un front avec du css. 
