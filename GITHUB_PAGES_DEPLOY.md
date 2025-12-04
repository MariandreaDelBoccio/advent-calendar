# 🚀 Deploy a GitHub Pages - Guía Rápida

## ✅ Ya está todo configurado

El proyecto ya tiene todo listo para GitHub Pages:
- ✅ Vite configurado con `base: '/advent-calendar/'`
- ✅ GitHub Actions workflow creado
- ✅ Script de deploy en package.json
- ✅ gh-pages instalado

---

## 📋 Pasos para Deploy

### 1️⃣ Crear repositorio en GitHub

```bash
# Si aún no lo has hecho
git remote add origin https://github.com/TU_USUARIO/advent-calendar.git
```

### 2️⃣ Subir el código

```bash
git add -A
git commit -m "chore: configure GitHub Pages deployment"
git push -u origin main
```

### 3️⃣ Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - **GitHub Actions** (recomendado)
   
   O si prefieres el método manual:
   - **Deploy from a branch**
   - Branch: `gh-pages`
   - Folder: `/ (root)`

### 4️⃣ Deploy Automático (Recomendado)

El workflow de GitHub Actions se ejecutará automáticamente en cada push a `main`.

Puedes ver el progreso en:
- **Actions** tab en tu repositorio
- Espera a que termine (2-3 minutos)
- Tu sitio estará en: `https://TU_USUARIO.github.io/advent-calendar/`

### 5️⃣ Deploy Manual (Alternativo)

Si prefieres hacer deploy manual:

```bash
npm run deploy
```

Esto:
1. Hace build del proyecto
2. Sube la carpeta `dist` a la rama `gh-pages`
3. GitHub Pages lo publica automáticamente

---

## 🔧 Configuración Importante

### Si tu repositorio tiene otro nombre

Si tu repo NO se llama `advent-calendar`, actualiza en `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  base: '/TU-NOMBRE-DE-REPO/',
})
```

### Si quieres usar dominio personalizado

1. Crea un archivo `public/CNAME` con tu dominio:
```
tudominio.com
```

2. Configura DNS en tu proveedor:
```
Type: CNAME
Name: www
Value: TU_USUARIO.github.io
```

---

## 🐛 Troubleshooting

### Página en blanco
- Verifica que `base` en `vite.config.ts` coincida con el nombre del repo
- Asegúrate de que GitHub Pages esté habilitado en Settings

### 404 en rutas
- GitHub Pages no soporta SPA routing por defecto
- Solución: Agrega un `404.html` que redirija a `index.html`

```bash
# Crear 404.html
cp dist/index.html dist/404.html
```

O mejor, agrega esto al build:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        const fs = require('fs');
        fs.copyFileSync('dist/index.html', 'dist/404.html');
      }
    }
  ],
  base: '/advent-calendar/',
})
```

### Actions falla
- Verifica que Pages esté habilitado en Settings
- Asegúrate de que el workflow tenga permisos correctos
- Revisa los logs en la pestaña Actions

---

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] GitHub Pages habilitado en Settings
- [ ] Workflow ejecutado exitosamente
- [ ] Sitio accesible en `https://TU_USUARIO.github.io/advent-calendar/`
- [ ] Todas las páginas funcionan
- [ ] Juegos cargan correctamente
- [ ] Imágenes y assets se ven bien

---

## 🎉 ¡Listo!

Tu Calendario de Adviento está ahora **LIVE** en GitHub Pages.

### 🔗 URL de tu sitio:
```
https://TU_USUARIO.github.io/advent-calendar/
```

¡Compártelo con el mundo! 🚀🎊
