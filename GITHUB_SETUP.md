# 🚀 Configuración de GitHub

## Pasos para subir el proyecto a GitHub

### 1. Crear el repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repositorio: `advent-calendar` (o el que prefieras)
3. Descripción: "🍫 Calendario de Adviento interactivo con juegos y premios"
4. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
5. Click en "Create repository"

### 2. Conectar tu repositorio local con GitHub

```bash
# Agrega el remote de GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/advent-calendar.git

# Verifica que se agregó correctamente
git remote -v

# Sube el código a GitHub
git push -u origin main
```

### 3. Configurar el repositorio (Opcional pero recomendado)

En GitHub, ve a Settings de tu repositorio:

#### Topics (Etiquetas)
Agrega estos topics para mejor visibilidad:
- `react`
- `typescript`
- `tailwindcss`
- `vite`
- `advent-calendar`
- `framer-motion`
- `game`

#### About (Descripción)
- Description: "🍫 Calendario de Adviento interactivo con juegos, premios y logros. Responsive design con React + TypeScript"
- Website: (tu URL de deploy cuando esté listo)
- ✅ Marca "Use your GitHub Pages website"

#### GitHub Pages (Para deploy gratuito)
1. Ve a Settings > Pages
2. Source: GitHub Actions
3. Crea el archivo `.github/workflows/deploy.yml` (ver abajo)

### 4. Workflow de Deploy Automático (Opcional)

Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 5. Proteger la rama main (Recomendado para trabajo en equipo)

Settings > Branches > Add rule:
- Branch name pattern: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging

### 6. Estructura de Branches Recomendada

```bash
# Crear branch de desarrollo
git checkout -b develop
git push -u origin develop

# Para nuevas features
git checkout -b feature/calendar-page
# ... hacer cambios ...
git add .
git commit -m "feat: add calendar page with 24 days grid"
git push -u origin feature/calendar-page
# Luego crear Pull Request en GitHub
```

## 📝 Convenciones de Commits

Usa estos prefijos para commits claros:

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `refactor:` - Refactorización de código
- `style:` - Cambios de estilos/formato
- `docs:` - Documentación
- `test:` - Tests
- `chore:` - Tareas de mantenimiento

### Ejemplos:
```bash
git commit -m "feat: add achievements page with 9 unlockable items"
git commit -m "fix: navbar responsive menu not closing on mobile"
git commit -m "style: improve calendar grid spacing on tablet"
git commit -m "docs: update README with installation instructions"
```

## 🎯 Workflow Recomendado

1. **Desarrollo local**: Trabaja en `feature/nombre-feature`
2. **Commit frecuente**: Commits pequeños y descriptivos
3. **Push regular**: Sube tus cambios a GitHub
4. **Pull Request**: Crea PR de feature → develop
5. **Review**: Revisa el código (o pide review)
6. **Merge**: Merge a develop
7. **Release**: Cuando esté listo, merge develop → main

## 🔒 Archivo .env (NO subir a GitHub)

Si necesitas variables de entorno:

```bash
# Crea .env en la raíz
echo ".env" >> .gitignore
```

Ejemplo `.env`:
```
VITE_API_URL=https://api.ejemplo.com
VITE_MAP_API_KEY=tu_api_key_aqui
```

## 📊 README Badge (Opcional)

Agrega badges al README.md:

```markdown
![GitHub](https://img.shields.io/github/license/TU_USUARIO/advent-calendar)
![GitHub stars](https://img.shields.io/github/stars/TU_USUARIO/advent-calendar)
![GitHub forks](https://img.shields.io/github/forks/TU_USUARIO/advent-calendar)
```

---

¡Listo! Tu proyecto está configurado profesionalmente en GitHub 🎉
