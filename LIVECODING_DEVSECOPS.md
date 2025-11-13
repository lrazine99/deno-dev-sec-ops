# Guide de Livecoding DevSecOps avec Deno - 10 minutes

## Vue d'ensemble

Cette vidéo présente les fonctionnalités DevSecOps intégrées de Deno pour créer des applications sécurisées dès le départ.

## Résumé exécutif

**Objectifs de la vidéo:**

1. ✅ Configurer un projet Deno avec sécurité intégrée
2. ✅ Créer une API sécurisée avec validation et headers de sécurité
3. ✅ Utiliser les outils intégrés (lint, format, test, audit)
4. ✅ Mettre en place un pipeline CI/CD DevSecOps
5. ✅ Déployer l'application avec Deno Deploy

**Fichiers du projet:**

- `deno.json` - Configuration du projet avec sécurité
- `server.ts` - API sécurisée avec validation
- `server_test.ts` - Tests de sécurité
- `.github/workflows/devsecops.yml` - Pipeline CI/CD

**Commandes principales:**

```bash
deno fmt          # Formater
deno lint          # Linter
deno test          # Tester
deno audit         # Auditer
deno check         # Vérifier les types
```

---

## Timing (10 minutes)

### [0:00 - 1:00] Introduction et Setup

**Parler de:**

- Deno est sécurisé par défaut (pas d'accès réseau, fichiers, etc. sans permissions explicites)
- DevSecOps = Développement + Sécurité + Opérations
- Deno intègre nativement: linter, formatter, test runner, security audit
- `deno init` crée automatiquement la structure de base du projet

**Commandes à exécuter:**

```bash
# Vérifier la version de Deno
deno --version

# Créer le projet avec deno init
mkdir deno-devsecops-demo
cd deno-devsecops-demo
deno init

# Voir ce qui a été créé
ls -la
```

**Parler de ce que `deno init` crée:**

- `deno.json` - Fichier de configuration (peut être vide au départ)
- `main.ts` - Point d'entrée principal (on le renommera en `server.ts`)
- `main_test.ts` - Fichier de tests (on le renommera en `server_test.ts`)
- `.gitignore` - Fichier gitignore pour Deno

---

### [1:00 - 2:30] Configuration du projet (deno.json)

**Parler de:**

- `deno init` a créé un `deno.json` de base (peut être vide)
- On va l'enrichir avec la configuration de sécurité
- Configuration centralisée pour la sécurité
- Paramètres de lint, format, imports
- Configuration des permissions

**Action:**

- Ouvrir et modifier `deno.json` (voir le fichier `deno.json` du projet)
- Expliquer chaque section:
  - `compilerOptions`: options strictes TypeScript
  - `lint`: règles de sécurité
  - `fmt`: formatage cohérent
  - `imports`: alias pour les dépendances
  - `deploy`: configuration Deno Deploy

**Commandes:**

```bash
# Voir le contenu actuel de deno.json
cat deno.json

# Vérifier la configuration
deno check server.ts
```

---

### [2:30 - 4:00] Création d'une API sécurisée

**Parler de:**

- Renommer `main.ts` en `server.ts` (ou créer directement)
- Permissions explicites de Deno
- Validation des entrées
- Headers de sécurité

**Commandes:**

```bash
# Option 1: Renommer main.ts en server.ts
mv main.ts server.ts

# Option 2: Créer directement server.ts
# (on peut garder main.ts pour référence)
```

**Action:**

- Ouvrir et expliquer `server.ts` (voir le fichier `server.ts` du projet)
- Points clés à expliquer:
  - Interface `User` pour le typage
  - Fonction `isValidEmail()` pour la validation
  - Fonction `validateUser()` pour valider les entrées
  - Middleware `securityHeaders` avec headers HTTP de sécurité
  - Route GET `/users` pour récupérer les utilisateurs
  - Route POST `/users` avec validation et sanitization XSS
  - Destructuration de `request` et `response` depuis `ctx`
  - Utilisation de `router.allowedMethods()` pour gérer les méthodes HTTP

**Note:** Expliquer que ce code nécessite des permissions réseau: `deno run --allow-net server.ts`

**Tester en direct:**

```bash
# Démarrer le serveur
deno run --allow-net server.ts

# Dans un autre terminal, tester
curl http://localhost:8000/users
```

---

### [4:00 - 5:30] Linting et Formatting

**Parler de:**

- Détection automatique des problèmes de sécurité
- Formatage cohérent du code
- Intégration dans le workflow

**Commandes à exécuter:**

```bash
# Linter le code
deno lint server.ts

# Formatter le code
deno fmt server.ts

# Vérifier le formatage sans modifier
deno fmt --check server.ts

# Linter avec règles de sécurité
deno lint --rules=security server.ts
```

**Exemple de problème de sécurité à montrer:**

```typescript
// ❌ Code vulnérable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Code sécurisé
const query = "SELECT * FROM users WHERE id = ?";
```

**Points à mentionner:**

- Le linter détecte les problèmes de sécurité courants
- Le formatter assure la cohérence du code
- Ces outils s'intègrent dans le workflow de développement

---

### [5:30 - 7:00] Tests de sécurité

**Parler de:**

- Tests unitaires intégrés
- Tests de sécurité
- Coverage

**Commandes:**

```bash
# Renommer main_test.ts en server_test.ts
mv main_test.ts server_test.ts
```

**Action:**

- Ouvrir et expliquer `server_test.ts` (voir le fichier `server_test.ts` du projet)
- Points clés à expliquer:
  - Import de `assertEquals` depuis `jsr:@std/assert`
  - Test de validation d'email invalide
  - Test de sanitization XSS
  - Test des headers de sécurité
  - Test de création d'utilisateur valide
  - Tests de rejet (nom vide, nom trop court)

**Commandes:**

```bash
# ⚠️ IMPORTANT: Démarrer le serveur avant de lancer les tests
# Terminal 1:
deno run --allow-net server.ts

# Terminal 2:
deno test --allow-net server_test.ts

# Tests avec coverage
deno test --coverage=cov_profile --allow-net server_test.ts
deno coverage cov_profile
```

---

### [7:00 - 8:30] Audit de sécurité des dépendances

**Parler de:**

- Vérification automatique des vulnérabilités
- Gestion des dépendances
- Lock file pour la reproductibilité

**Commandes à exécuter:**

```bash
# Créer un lock file pour la reproductibilité
deno cache --lock=deno.lock --lock-write server.ts server_test.ts

# Vérifier les vulnérabilités dans les dépendances
deno audit

# Vérifier l'intégrité des dépendances
deno cache --reload --lock=deno.lock server.ts
```

**Expliquer:**

- Le fichier `deno.lock` garantit la reproductibilité
- `deno audit` vérifie les vulnérabilités connues
- L'audit est automatique dans le pipeline CI/CD

**Tester l'API en direct (dans un autre terminal):**

```bash
# Tester GET /users
curl http://localhost:8000/users

# Tester POST avec données valides
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'

# Tester POST avec email invalide (doit échouer)
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"invalid-email"}'

# Vérifier les headers de sécurité
curl -I http://localhost:8000/users
```

---

### [8:30 - 9:15] CI/CD avec GitHub Actions

**Parler de:**

- Automatisation des vérifications de sécurité
- Pipeline DevSecOps
- Intégration continue

**Action:**

- Ouvrir et expliquer `.github/workflows/devsecops.yml` (voir le fichier du projet)
- Points clés à expliquer:
  - Job `security`: vérifications automatiques (fmt, lint, audit, check, test)
  - Job `deploy`: déploiement automatique sur Deno Deploy
  - Déclenchement sur push et pull request
  - Cache des dépendances pour performance
  - Coverage report

**Commandes:**

```bash
# Vérifier le workflow localement (si possible)
# Les workflows s'exécutent automatiquement sur GitHub
```

---

### [9:15 - 9:45] Déploiement avec Deno Deploy

**Parler de:**

- Deno Deploy = plateforme de déploiement native pour Deno
- Déploiement en quelques secondes
- HTTPS automatique, edge computing
- Intégration avec GitHub pour déploiement automatique

**Option 1: Déploiement via CLI (démo rapide)**

```bash
# Installer Deno Deploy CLI
deno install -A jsr:@deno/deployctl --global

# Se connecter (première fois)
deployctl login

# Déployer le projet
deployctl deploy --project=mon-projet-securise server.ts
```

**Option 2: Intégration GitHub native (recommandé - le plus simple)**

```bash
# Sur deno.com/deploy :
# 1. Créer un nouveau projet
# 2. Connecter le repository GitHub
# 3. Sélectionner le fichier d'entrée (server.ts)
# 4. Déploiement automatique à chaque push sur main
```

**Option 3: Déploiement via GitHub Actions (pour plus de contrôle)**

- Le workflow `.github/workflows/devsecops.yml` inclut déjà le job `deploy`
- Nécessite le token `DENO_DEPLOY_TOKEN` dans les secrets GitHub

**Étapes pour déployer:**

```bash
# Méthode 1: Via l'interface web (le plus simple)
# 1. Aller sur deno.com/deploy
# 2. Se connecter avec GitHub
# 3. Créer un nouveau projet
# 4. Connecter le repository
# 5. Configurer: entrypoint = server.ts
# 6. Déploiement automatique !

# Méthode 2: Via CLI (pour obtenir le token)
# 1. deployctl login
# 2. Créer un projet sur le dashboard
# 3. Obtenir le token d'API
# 4. Ajouter comme secret GitHub: DENO_DEPLOY_TOKEN

# Vérifier le déploiement
curl https://mon-projet-securise.deno.dev/users

# Vérifier les headers de sécurité en production
curl -I https://mon-projet-securise.deno.dev/users
```

**Avantages de Deno Deploy:**

- ✅ Déploiement instantané
- ✅ HTTPS automatique
- ✅ Edge computing (latence réduite)
- ✅ Scaling automatique
- ✅ Pas de configuration serveur nécessaire

---

### [9:45 - 10:00] Résumé et Bonnes Pratiques

**Points à mentionner:**

1. **Permissions explicites**
   ```bash
   # Toujours spécifier les permissions nécessaires
   deno run --allow-net --allow-read server.ts
   ```

2. **Validation des entrées**
   - Toujours valider et sanitizer les données utilisateur
   - Utiliser des schémas de validation

3. **Headers de sécurité**
   - Toujours inclure les headers de sécurité HTTP
   - Protéger contre XSS, clickjacking, etc.

4. **Dépendances**
   - Utiliser `deno.lock` pour la reproductibilité
   - Auditer régulièrement avec `deno audit`

5. **Tests**
   - Tester les cas de sécurité
   - Inclure des tests pour les vulnérabilités communes

6. **CI/CD**
   - Automatiser toutes les vérifications
   - Bloquer les merges si les checks échouent

7. **Déploiement**
   - Utiliser Deno Deploy pour un déploiement rapide et sécurisé
   - Intégrer le déploiement dans le pipeline CI/CD
   - Tester en production après déploiement

**Commandes finales:**

```bash
# Workflow complet avant commit (dans l'ordre)
deno fmt                    # Formater le code
deno lint                   # Vérifier le style et les erreurs
deno check server.ts        # Vérifier les types TypeScript
deno audit                  # Auditer les dépendances
deno test --allow-net       # Lancer les tests
```

**Script de pré-commit (optionnel):**

```bash
#!/bin/bash
# .git/hooks/pre-commit
deno fmt --check && \
deno lint && \
deno check server.ts && \
deno audit && \
deno test --allow-net
```

---

## Checklist avant la vidéo

- [ ] Deno installé (version 1.x ou supérieure)
- [ ] Éditeur de code configuré
- [ ] Terminal ouvert
- [ ] Connexion internet (pour les imports)
- [ ] Compte GitHub (pour CI/CD)
- [ ] Compte Deno Deploy (optionnel, peut être créé pendant la démo)

**Note:** `deno init` crée automatiquement:
- `deno.json` (configuration)
- `main.ts` (point d'entrée)
- `main_test.ts` (tests)
- `.gitignore` (fichiers à ignorer par git)

## Notes pour le présentateur

1. **Parler lentement** - Expliquer chaque commande avant de l'exécuter
2. **Montrer les erreurs** - Si une commande échoue, expliquer pourquoi
3. **Interagir avec le code** - Modifier le code en direct pour montrer les réactions
4. **Tester en direct** - Utiliser curl ou un client HTTP pour tester l'API
5. **Expliquer les concepts** - Ne pas juste coder, expliquer le "pourquoi"
6. **Référencer les fichiers** - Pointer vers les fichiers existants plutôt que de réécrire le code

## Structure des fichiers

```
deno/
├── deno.json              # Configuration (compilerOptions, lint, fmt, imports)
├── server.ts              # API sécurisée avec validation et headers
├── server_test.ts         # Tests de sécurité (6 tests)
├── .github/
│   └── workflows/
│       └── devsecops.yml  # Pipeline CI/CD avec déploiement
└── README.md              # Documentation
```

## Ressources supplémentaires

- Documentation Deno: https://deno.land/manual
- Deno Security: https://deno.land/manual/security
- Deno Deploy: https://deno.com/deploy
- Oak Framework: https://oakserver.github.io/oak/

---

**Durée totale: ~10 minutes**
**Niveau: Intermédiaire**
**Public cible: Développeurs intéressés par DevSecOps**
