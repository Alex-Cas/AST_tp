# Asynchronous Server Technologies TP1
Le serveur est une introduction aux routes et à NodeJS

## Présentation
Nous pouvons accéder à 3 pages distinctes avec 3 urls :

```
1. localhost:8080/
2. localhost:8080/hello
3. localhost:8080/hello?name=xxx
```

Lancer le serveur avec la commande :

```
node .\index.js
```

## Utilisation

### Page *Home*
La page *Home* est une introduction du site avec différentes instructions

### Pages *Hello*
Les pages *Hello* sont divisées en 2.

L'url 2. renvoi un message de bienvenue simple.

L'url 3. renvoi un message de bienvenue contenant le nom de la personne entrée en paramètres dans l'url (remplacer 'xxx' par son nom).

Une page spéciale est renvoyée lorsque le nom entré en paramètre est **Alexandre**.

### Pages non trouvées
Une url qui n'est pas repertoriée ci-dessus renverra une message d'erreur 404.
