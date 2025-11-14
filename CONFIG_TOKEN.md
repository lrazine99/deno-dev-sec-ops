# Configuration du token Deno Deploy

## ⚠️ Erreur actuelle

```
error: Uncaught (in promise) APIError: The authorization token is not valid
```

Cette erreur signifie que le secret `DENO_DEPLOY_TOKEN` n'est pas configuré ou est invalide dans GitHub.

## ✅ Solution étape par étape

### Étape 1: Obtenir un nouveau token Deno Deploy

1. Aller sur [deno.com/deploy](https://deno.com/deploy)
2. **Se connecter** avec votre compte
3. Cliquer sur votre **profil** (en haut à droite)
4. Aller dans **Settings**
5. Dans le menu de gauche, cliquer sur **Access Tokens**
6. Cliquer sur **Create Token**
7. Donner un nom (ex: "GitHub Actions - deno-dev-sec-ops")
8. **⚠️ IMPORTANT:** Copier le token immédiatement (format: `ddp_...`)
   - Vous ne pourrez plus le voir après !

### Étape 2: Ajouter le secret dans GitHub

1. Aller sur votre repository GitHub
2. Cliquer sur **Settings** (en haut du repository)
3. Dans le menu de gauche, cliquer sur **Secrets and variables**
4. Cliquer sur **Actions** (pas "Environments")
5. Cliquer sur l'onglet **Secrets** (en haut)
6. Cliquer sur **New repository secret**
7. Remplir:
   - **Name:** `DENO_DEPLOY_TOKEN` (exactement comme ça, sensible à la casse)
   - **Secret:** Coller le token copié à l'étape 1
8. Cliquer sur **Add secret**

### Étape 3: Vérifier

1. Le secret `DENO_DEPLOY_TOKEN` doit apparaître dans la liste
2. La valeur sera masquée (normal pour la sécurité)
3. Vous pouvez cliquer dessus pour le modifier si nécessaire

### Étape 4: Relancer le workflow

1. Aller dans l'onglet **Actions** de votre repository
2. Trouver le workflow qui a échoué
3. Cliquer sur **Re-run jobs** ou **Re-run failed jobs**

## 🔍 Vérifications

### Vérifier que le secret existe

Dans GitHub:
- Repository → Settings → Secrets and variables → Actions → Secrets
- Chercher `DENO_DEPLOY_TOKEN` dans la liste

### Vérifier le nom du projet

Dans `.github/workflows/devsecops.yml` (ligne 59):
```yaml
deployctl deploy --project=mon-projet-securise --entrypoint=server.ts
```

Le nom `mon-projet-securise` doit correspondre **exactement** au nom du projet sur Deno Deploy.

## 🚫 Si le problème persiste

### Option 1: Désactiver temporairement le déploiement

Commentez le job `deploy` dans `.github/workflows/devsecops.yml`:

```yaml
# deploy:
#   needs: security
#   ...
```

### Option 2: Utiliser seulement Deno Deploy (sans workflow)

- Désactiver le job `deploy` dans le workflow
- Laisser Deno Deploy builder automatiquement sur chaque commit
- Perte des vérifications de sécurité avant déploiement

## 📝 Note importante

Le workflow a été modifié pour ne s'exécuter que si le secret existe:
```yaml
if: github.ref == 'refs/heads/main' && secrets.DENO_DEPLOY_TOKEN != ''
```

Si le secret n'existe pas, le job `deploy` sera simplement ignoré (pas d'erreur).

