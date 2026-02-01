# Presupuesto Casamiento - Bebidas

Dashboard para gestionar el presupuesto de bebidas del casamiento. Permite cargar bebidas, cantidades, precios y notas, con resumen de gasto y ahorro. UI minimalista tipo "ChatGPT-like": limpia, legible y con microinteracciones suaves.

## Requisitos
- Node.js 18+

## Configuracion
Crea un archivo `.env` en la raiz con:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_PRESUPUESTO_SLUG=default
VITE_ALLOWED_EMAILS=mail1@dominio.com,mail2@dominio.com
```

- `VITE_PRESUPUESTO_SLUG` identifica el presupuesto a cargar.
- `VITE_ALLOWED_EMAILS` es opcional; si esta vacio, no restringe por email.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Apps nativas (Capacitor)
Este proyecto puede empaquetarse como app nativa para Android/iOS usando Capacitor.

### Requisitos adicionales
- Android: Android Studio + Android SDK
- iOS: macOS + Xcode + CocoaPods

### Flujo basico
```bash
npm run build
npx cap sync
```

### Abrir proyectos nativos
```bash
npx cap open android
npx cap open ios
```

### Notas
- iOS solo puede compilarse en macOS.
- Cada vez que cambies el frontend, corre `npm run build` y luego `npx cap sync`.

## Estructura principal
- `src/components/Dashboard.tsx`: vista principal, auth y datos.
- `src/components/BebidaForm.tsx`: formulario alta/edicion.
- `src/components/BebidaCard.tsx`: card por bebida.
- `src/components/ResumenTotal.tsx`: resumen y KPIs.
- `src/components/ComentarioModal.tsx`: notas.

## Notas
- La app usa Supabase para auth y persistencia.
- Si falta la config de Supabase, el frontend no puede cargar datos.
