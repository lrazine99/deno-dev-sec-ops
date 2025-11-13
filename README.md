# Projet DevSecOps avec Deno

Projet de démonstration des fonctionnalités DevSecOps intégrées de Deno.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
deno cache server.ts server_test.ts

# Démarrer le serveur
deno run --allow-net server.ts

# Dans un autre terminal, lancer les tests
deno test --allow-net server_test.ts
```

## 📋 Commandes utiles

```bash
# Formater le code
deno fmt

# Linter le code
deno lint

# Vérifier les types
deno check server.ts

# Auditer les dépendances
deno audit

# Créer le lock file
deno cache --lock=deno.lock --lock-write server.ts server_test.ts
```

## 🧪 Tester l'API

```bash
# GET tous les utilisateurs
curl http://localhost:8000/users

# POST créer un utilisateur
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'

# Vérifier les headers de sécurité
curl -I http://localhost:8000/users
```

## 📁 Fichiers

- `server.ts` - API sécurisée avec validation et headers de sécurité
- `server_test.ts` - Tests de sécurité
- `deno.json` - Configuration du projet
- `.github/workflows/devsecops.yml` - Pipeline CI/CD

## 🚢 Déploiement

### Configuration du token (requis pour CI/CD)

Pour activer le déploiement automatique via GitHub Actions:

1. **Obtenir un token Deno Deploy:**
   - Aller sur [deno.com/deploy](https://deno.com/deploy)
   - Settings → Access Tokens → Create Token
   - Copier le token

2. **Ajouter le secret dans GitHub:**
   - Repository → Settings → Secrets and variables → Actions
   - New repository secret
   - Nom: `DENO_DEPLOY_TOKEN`
   - Valeur: coller le token

📖 **Instructions détaillées:** Voir `SETUP_DEPLOY.md`

### Déploiement automatique

Le workflow `.github/workflows/devsecops.yml` déploie automatiquement sur la branche `main` après les tests de sécurité.
