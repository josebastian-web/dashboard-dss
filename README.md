# Dashboard DSS

Esto es un proyecto de aplicación web con una interfaz de usuario moderna y adaptable, construida sobre el framework de Vue.js y el robusto conjunto de componentes de Vuetify.

## Requisitos

Asegúrate de tener instalado lo siguiente en tu sistema para poder ejecutar el proyecto correctamente:

* **Node.js**: Versión 16.0 o superior. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

* **Gestor de paquetes**: `npm`, `yarn` o `pnpm`. `npm` viene incluido con Node.js.

## Instalación

Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

1. **Clona el repositorio**:

   ```
   git clone https://github.com/josebastian-web/dashboard-dss.git
   
   ```

2. **Navega al directorio del proyecto**:

   ```
   cd dashboard-dss
   
   ```

3. **Instala las dependencias**:
   Utiliza tu gestor de paquetes preferido.

   ```
   # Con npm
   npm install
   
   # Con yarn
   yarn install
   
   # Con pnpm
   pnpm install
   
   ```

## Scripts Disponibles

En la raíz del proyecto, puedes ejecutar varios comandos útiles:

| Comando | Descripción | 
 | ----- | ----- | 
| `npm run dev` | Inicia el servidor de desarrollo en caliente (hot-reloading). Visita `http://localhost:3000` en tu navegador. | 
| `npm run build` | Compila la aplicación para producción en el directorio `dist`. | 
| `npm run preview` | Sirve la aplicación compilada localmente para previsualizar el resultado de producción. | 
| `npm run lint` | Analiza el código en busca de posibles errores y problemas de estilo. | 
| `npm run test` | Ejecuta las pruebas unitarias (si están configuradas). | 

## Estructura del Proyecto

A continuación, se muestra un resumen de la estructura de archivos y directorios principales:

```
.
├── public/                 # Archivos estáticos públicos (index.html, favicon, etc.)
├── src/
│   ├── assets/             # Imágenes, iconos, fuentes
│   ├── components/         # Componentes reutilizables de Vue
│   ├── data/               # Archivos de data en formato json
│   ├── pages/              # Vistas principales de tu aplicación
│   ├── plugins/            # Archivos de configuración para plugins (Vuetify, Router)
│   │   ├── vuetify.ts      # Configuración del tema de Vuetify
│   ├── router/             # Definición de rutas (si usas Vue Router)
│   ├── store/              # Definición de stores (si usas Pinia)
│   ├── styles/             # Hojas de estilo globales (SCSS/CSS)
│   ├── types/              # Definición de interfaces
│   └── App.vue             # Componente raíz de la aplicación
├── .gitignore              # Archivos y directorios a ignorar por Git
├── package.json            # Metadatos y dependencias del proyecto
└── vite.config.ts          # Configuración de Vite

```

## Configuración del Tema de Vuetify

Puedes personalizar el tema de colores, la tipografía y otros aspectos de la interfaz en el archivo:

`src/plugins/vuetify.ts`

Aquí puedes modificar los colores `primary`, `secondary`, `background`, y otros para que coincidan con la identidad de tu marca.

## Personalización

* **Componentes**: Para crear tus propios componentes reutilizables, agrégalos en el directorio `src/components`.

* **Estilos**: Para estilos globales o variables SCSS, utiliza el directorio `src/styles`.
