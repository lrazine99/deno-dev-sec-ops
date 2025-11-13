# Configuration du déploiement avec Deno Deploy

## Étape 1: Obtenir le token Deno Deploy

### Méthode 1: Via l'interface web (recommandé)

1. Aller sur [deno.com/deploy](https://deno.com/deploy)
2. Se connecter avec votre compte GitHub
3. Aller dans **Settings** → **Access Tokens**
4. Cliquer sur **Create Token**
5. Donner un nom au token (ex: "GitHub Actions Deploy")
6. Copier le token généré (⚠️ **Important**: vous ne pourrez plus le voir après)

### Méthode 2: Via CLI

```bash
# Installer deployctl
deno install -A jsr:@deno/deployctl --global

# Se connecter
deployctl login

# Le token sera sauvegardé localement, mais pour GitHub Actions,
# il est préférable d'utiliser la méthode 1
```

## Étape 2: Ajouter le secret dans GitHub

1. Aller sur votre repository GitHub
2. Cliquer sur **Settings** (en haut du repository)
3. Dans le menu de gauche, cliquer sur **Secrets and variables** → **Actions**
4. Cliquer sur **New repository secret**
5. Nom du secret: `DENO_DEPLOY_TOKEN`
6. Valeur: coller le token copié à l'étape 1
7. Cliquer sur **Add secret**

## Étape 3: Vérifier le workflow

Le workflow `.github/workflows/devsecops.yml` utilise déjà le secret:

```yaml
env:
  DENO_DEPLOY_TOKEN: ${{ secrets.DENO_DEPLOY_TOKEN }}
```

## Étape 4: Créer le projet sur Deno Deploy

1. Aller sur [deno.com/deploy](https://deno.com/deploy)
2. Cliquer sur **New Project**
3. Donner un nom au projet (ex: `mon-projet-securise`)
4. Sélectionner le repository GitHub
5. Configurer:
   - **Entrypoint**: `server.ts`
   - **Root**: `/` (racine du projet)
6. Cliquer sur **Create**

## Vérification

Après avoir poussé sur la branche `main`, le workflow devrait:
1. Exécuter les tests de sécurité
2. Si tout passe, déployer automatiquement sur Deno Deploy
3. L'application sera accessible à: `https://mon-projet-securise.deno.dev`

## Dépannage

Si le déploiement échoue:

1. Vérifier que le secret `DENO_DEPLOY_TOKEN` est bien configuré dans GitHub
2. Vérifier que le nom du projet dans le workflow correspond au projet sur Deno Deploy
3. Vérifier les logs du workflow dans l'onglet **Actions** de GitHub

