# Bank Frontend

Frontend React moderne pour la banque (architecture microservices, Spring Boot + React + OAuth2/JWT).

## Fonctionnalités principales
- Authentification OAuth2 (Spring Authorization Server, JWT)
- Dashboard utilisateur (infos, comptes, transactions, cartes, prêts, notifications)
- Navigation moderne (sidebar Material-UI)
- Formulaire de virement (transfert d’argent entre comptes)
- Formulaire de demande de prêt
- Appels API sécurisés via la gateway (token JWT injecté automatiquement)
- Thème rouge Material-UI

## Installation

```sh
cd bank-front
npm install
```

## Lancement en développement

```sh
npm start
```

L’application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Configuration OAuth2
- Le frontend utilise OIDC/OAuth2 avec le serveur d’authentification sur `http://localhost:9000` (Spring Authorization Server)
- Client configuré :
  - client_id : `bank-client`
  - redirect_uri : `http://localhost:3000/callback`
- Les tokens JWT sont stockés en localStorage et injectés dans tous les appels API

## Structure du projet

```
src/
  components/      # Sidebar, composants réutilisables
  pages/           # Pages principales (Login, Dashboard, Transactions, Loans, etc.)
  services/        # authService (OIDC), api (Axios)
  store/           # (optionnel) Redux Toolkit
  theme/           # Thème Material-UI
  App.tsx          # Routage principal
  index.tsx        # Entrée de l’app
```

## Sécurité
- Toutes les routes (sauf / et /callback) nécessitent une authentification JWT valide
- Les rôles (USER, ADMIN) sont gérés côté backend et affichés dans le dashboard
- Les appels API passent par la gateway (`http://localhost:8080`)

## Fonctionnalités à venir
- Pages métiers détaillées (comptes, cartes, notifications…)
- Formulaires avancés (virement multi-comptes, gestion des bénéficiaires…)
- Responsive mobile
- Tests automatisés (Jest, React Testing Library)

## Dépendances principales
- React 18+
- Material-UI 5+
- Axios
- React Router 6
- react-hook-form
- oidc-client-ts (OAuth2/OpenID Connect)

## Contribution
- Fork, PR et suggestions bienvenues !
- Pour toute question technique, voir le backend ou contacter l’équipe dev.

---

**Projet full-stack bancaire moderne, sécurisé, évolutif.** 