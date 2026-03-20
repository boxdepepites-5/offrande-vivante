# L'Offrande Vivante — version simple Netlify

Projet de blog statique simple, éditable et déployable sur Netlify.

## Ce que contient ce projet
- Blog public léger et responsive
- Articles générés automatiquement depuis `content/posts`
- Formulaire de contact Netlify Forms
- Formulaire newsletter Netlify Forms
- Interface d'administration `/admin`
- Prévisualisation des articles dans l'admin

## Déploiement sur Netlify
1. Crée un dépôt GitHub et envoie ce projet.
2. Dans Netlify, choisis **Add new project** puis importe le dépôt.
3. Netlify détectera `netlify.toml`.
4. Lance le déploiement.
5. Tu recevras une URL gratuite du type `nom-du-site.netlify.app`.

## Activer la publication d'articles depuis /admin
Après le premier déploiement :
1. Va dans **Project configuration > Identity** et active Identity.
2. Active **Git Gateway**.
3. Invite ton email comme utilisateur.
4. Ouvre `/admin` sur ton site.
5. Connecte-toi, crée un article, prévisualise-le, puis publie-le.

## Formulaires Netlify
Les formulaires sont déjà configurés dans le HTML statique.
Après déploiement, les soumissions apparaîtront dans l'onglet **Forms** du projet Netlify.

## Développement local
```bash
npm install
npm run build
```
Le site généré est dans `dist/`.


## Contenu externe Claude
Si un lien public Claude ne peut pas être lu automatiquement au moment de l'édition, un brouillon prêt à compléter est disponible dans `content/posts/contenu-claude-a-integrer.md`.
Tu peux aussi l'ouvrir depuis `/admin`, coller le contenu, le prévisualiser puis le publier.
