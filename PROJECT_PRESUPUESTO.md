# Presupuesto Casamiento - Especificación del Proyecto

## Descripción
Dashboard para gestionar el presupuesto de bebidas del casamiento. Permite cargar cantidad, precios, y comentarios sobre dónde encontrar cada precio. Objetivo: llevar la cuenta y ahorrar lo más posible.

---

## Stack Técnico

| Tecnología | Propósito |
|------------|-----------|
| Vite | Build tool rápido |
| React 18 | UI Library |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos responsive |
| PWA | Instalable en móvil |
| localStorage | Persistencia local |

---

## Comandos Rápidos

### Iniciar Proyecto (Primera Vez)

```bash
cd Presupuesto
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npm install vite-plugin-pwa -D
npx tailwindcss init -p
npm run dev
```

### Desarrollo Diario

```bash
cd Presupuesto
npm run dev          # Servidor desarrollo http://localhost:5173
npm run build        # Build producción
npm run preview      # Preview build
```

---

## Estructura de Carpetas

```
Presupuesto/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx         # Vista principal
│   │   ├── BebidaCard.tsx        # Card para cada bebida
│   │   ├── BebidaForm.tsx        # Formulario agregar/editar
│   │   ├── ResumenTotal.tsx      # Totales y ahorro
│   │   └── ComentarioModal.tsx   # Modal para notas
│   ├── hooks/
│   │   └── useLocalStorage.ts    # Persistencia automática
│   ├── types/
│   │   └── bebida.ts             # Interfaces TypeScript
│   ├── utils/
│   │   └── calculations.ts       # Cálculos de totales
│   ├── App.tsx                   # Componente raíz
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos Tailwind
├── public/
│   ├── manifest.json             # PWA manifest
│   └── icons/                    # Iconos para PWA
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── PROJECT_PRESUPUESTO.md        # Este archivo
```

---

## Modelo de Datos

```typescript
// src/types/bebida.ts

export interface Bebida {
  id: string;
  nombre: string;           // "Fernet", "Vino Tinto", etc.
  categoria: CategoriaBebia;
  cantidad: number;         // Unidades a comprar
  precioUnitario: number;   // Precio por unidad
  lugarPrecio: string;      // "Carrefour", "Mayorista X"
  comentarios: string;      // Notas adicionales
  fechaActualizacion: Date;
}

export type CategoriaBebida =
  | 'destilado'     // Fernet, Whisky, Vodka
  | 'vino'          // Tinto, Blanco, Espumante
  | 'cerveza'       // Latas, Botellas
  | 'sin-alcohol'   // Gaseosas, Agua, Jugos
  | 'otro';

export interface Presupuesto {
  bebidas: Bebida[];
  presupuestoObjetivo: number;  // Meta máxima de gasto
  moneda: 'ARS' | 'USD';
  fechaEvento: Date;
  cantidadInvitados: number;
}
```

---

## Funcionalidades

### MVP (Primera Versión)

- [ ] Dashboard con lista de bebidas
- [ ] Agregar nueva bebida (nombre, categoría, cantidad, precio)
- [ ] Editar bebida existente
- [ ] Eliminar bebida
- [ ] Campo "Lugar del precio" (dónde encontraste ese precio)
- [ ] Campo comentarios
- [ ] Resumen total (cantidad total, gasto total)
- [ ] Ahorro vs presupuesto objetivo
- [ ] Filtros por categoría
- [ ] Responsive (mobile-first)
- [ ] PWA instalable
- [ ] Persistencia local (localStorage)

### Futuras Mejoras

- [ ] Sync cloud para compartir con pareja (Supabase/Firebase)
- [ ] Historial de cambios de precio
- [ ] Exportar a Excel/PDF
- [ ] Calculadora de bebidas por invitado
- [ ] Múltiples eventos (no solo casamiento)
- [ ] Comparador de precios entre lugares
- [ ] Notificaciones de ofertas

---

## Configuración Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Configuración PWA

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Presupuesto Casamiento',
        short_name: 'Presupuesto',
        description: 'Gestión de presupuesto de bebidas',
        theme_color: '#3b82f6',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
```

---

## Hook de Persistencia

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

---

## Usuarios

- **Primario**: Vos
- **Secundario**: Tu pareja (sync futuro opcional)
- **Sin autenticación** en MVP (datos locales)

---

## Verificación Post-Implementación

1. [ ] `npm run dev` funciona sin errores
2. [ ] Agregar bebida → aparece en lista
3. [ ] Editar bebida → cambios se guardan
4. [ ] Refrescar página → datos persisten
5. [ ] Abrir en móvil → responsive correcto
6. [ ] "Agregar a pantalla inicio" → PWA funciona
7. [ ] Modo offline → app sigue funcionando

---

## Notas de Desarrollo

- **Mobile-first**: Diseñar primero para móvil
- **Auto-save**: Guardar automáticamente al editar
- **UX simple**: Pocas pantallas, acciones claras
- **Colores**: Usar azul/verde para positivo (ahorro), rojo para exceso

---

## Contacto / Repositorio

Proyecto personal para organización de casamiento.
Creado: Enero 2026
