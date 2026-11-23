# FIF Store

Aplicación web para la **compra y venta de productos entre compañeros de la FIF**. Los vendedores publican sus productos (botanas, dulces, bebidas, comida, etc.) y los compradores los exploran, los guardan en favoritos y contactan al vendedor por WhatsApp para comprarlos.

El diseño de las pantallas está basado en el prototipo de Figma del proyecto y está pensado para verse como una app móvil.

## Funcionalidades

| Ruta | Pantalla | Qué hace |
|---|---|---|
| `/` | Iniciar sesión | Acceso con correo institucional y contraseña. Incluye botón para cargar la cuenta demo. |
| `/registro` | Crear cuenta | Registro con nombre, correo institucional (`@uaq.edu.mx` o `@alumnos.uaq.mx`) y contraseña (mín. 6 caracteres). |
| `/feed` | Inicio | Catálogo con buscador y filtro por categoría (Papas, Galletas, Gomitas, Bebidas, Dulces, Comida). |
| `/producto/[id]` | Detalle | Vista de comprador (favorito, vendedor, botón **Comprar** por WhatsApp) o de dueño (editar, marcar como vendido, eliminar con confirmación). |
| `/producto/[id]/editar` | Editar publicación | Solo para el dueño de la publicación. |
| `/vender` | Nueva publicación | Fotos (hasta 4), nombre, precio, descripción y categoría. |
| `/favoritos` | Favoritos | Lista de productos guardados; estado vacío cuando no hay ninguno. |
| `/perfil` | Mi perfil | Datos del usuario, estadísticas y sus publicaciones. |
| `/perfil/editar` | Editar perfil | Nombre, carrera y teléfono. |
| `/vendedor/[id]` | Perfil de vendedor | Publicaciones disponibles del vendedor y botón **Contactar** por WhatsApp. |

## Tecnologías

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) con React 19 y TypeScript
- Tailwind CSS 4
- SQLite mediante [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- bcryptjs para guardar las contraseñas cifradas

## Requisitos

- Node.js **20.9 o superior**
- npm

## Instalación y ejecución

```bash
git clone https://github.com/Spacee44/Fif_Store.git
cd Fif_Store
npm ci          # instala exactamente las versiones de package-lock.json
npm run dev     # servidor de desarrollo
```

Abre [http://localhost:3000](http://localhost:3000). La base de datos (`fif_store.db`) ya viene en el repositorio con datos de ejemplo, así que no hace falta configurar nada más.

> Con npm 11 puede aparecer el aviso *"install scripts not yet covered by allowScripts"* para `better-sqlite3`, `esbuild` y `unrs-resolver`. No impide ejecutar la app: `better-sqlite3` ya incluye binarios precompilados para macOS, Linux y Windows.

### Cuentas de prueba

Todas usan la contraseña `password123`:

| Usuario | Correo |
|---|---|
| Alan Rubio | `alan.rubio@uaq.edu.mx` |
| Josue Castillo | `josue.castillo@uaq.edu.mx` |
| Daniel Fort | `daniel.fort@uaq.edu.mx` |
| Sofia Morales | `sofia.morales@uaq.edu.mx` |
| Carlos Mendoza | `carlos.mendoza@uaq.edu.mx` |

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en el puerto 3000. |
| `npm run build` / `npm start` | Compilación y servidor de producción. |
| `npm run lint` | Revisión con ESLint. |
| `node scripts/seed.js` | **Recrea** `fif_store.db` desde cero (5 usuarios, 100 productos, favoritos) y regenera `fif_store.sql`. ⚠️ Borra los usuarios y publicaciones creados desde la app. |
| `node scripts/generate-pdf.js` | Genera el reporte `FIF_Store_Reporte_Implementacion.pdf`. |

## Estructura del proyecto

```
app/
├── api/                     # API REST (Route Handlers)
│   ├── auth/                # login, logout, me, register
│   ├── favoritos/
│   └── productos/           # listado, alta y [id] (detalle, edición, borrado)
├── components/
│   ├── auth/                # login y registro
│   ├── favorites/
│   ├── main/                # feed y detalle de producto
│   ├── products/            # formulario de publicación (nueva / editar)
│   ├── profile/             # perfil propio, de vendedor y edición
│   └── ui/                  # marco móvil, barras, avatar, imagen de producto, diálogo
├── lib/
│   ├── auth.ts              # sesión (cookie) y contraseñas
│   ├── data.ts              # tipos, categorías y datos iniciales
│   ├── db.ts                # conexión y esquema de SQLite
│   └── store.ts             # estado del cliente sincronizado con la API
└── <rutas>/page.tsx         # una carpeta por pantalla (ver tabla de funcionalidades)
public/
├── icons/                   # íconos del diseño (navegación, acciones, categorías)
└── images/
    ├── productos/           # fotos de los 100 productos del catálogo
    └── *.png                # logotipos de FIF Store
scripts/                     # seed de la base de datos y generador del reporte PDF
fif_store.db                 # base de datos SQLite
fif_store.sql                # respaldo SQL del catálogo inicial
CREDITOS_IMAGENES.md         # fuente, autor y licencia de cada foto
```

## Base de datos

- **Archivo:** `fif_store.db` (SQLite, en la raíz del proyecto, modo WAL).
- **Tablas:** `usuarios`, `productos` y `favoritos`. El esquema se define en `app/lib/db.ts` y se crea automáticamente si no existe.
- **Respaldo:** `fif_store.sql` contiene el esquema y los datos iniciales; se puede importar en DBeaver, TablePlus u otro cliente SQL.

> **Antes de hacer commit de `fif_store.db`**, detén el servidor. Con el modo WAL, los cambios recientes pueden estar todavía en `fif_store.db-wal` (que Git ignora) y no en el archivo principal.

## Imágenes

| Qué | Dónde se guarda |
|---|---|
| **Fotos del catálogo (100 productos)** | Archivos locales en `public/images/productos/`. La base de datos guarda la ruta en la columna `productos.imagenes`, por ejemplo `["/images/productos/001-takis-fuego-240g.jpg"]`. |
| **Fotos que suben los usuarios** | El navegador las reduce (máx. 800 px) y las convierte a JPEG en Base64 (`app/components/products/productForm.tsx`). Se guardan como texto en la misma columna `productos.imagenes`. |
| **Íconos de respaldo por categoría** | `public/icons/` (`fries.png`, `cookie.png`, `candy.png`, `soda.png`, `pizza.png`). Se muestran si un producto no tiene foto o si la foto no carga. |
| **Logotipos** | `public/images/` |

Las fotos del catálogo provienen de [Open Food Facts](https://world.openfoodfacts.org) (empaques reales) y de [Wikimedia Commons](https://commons.wikimedia.org) (comida preparada). Todas tienen licencias libres; el detalle de cada una está en [CREDITOS_IMAGENES.md](CREDITOS_IMAGENES.md).

**Para cambiar la foto de un producto del catálogo:** reemplaza el archivo en `public/images/productos/` conservando el nombre, o guarda uno nuevo y actualiza la ruta en la columna `imagenes` de la base de datos, en `scripts/seed.js` y en `app/lib/data.ts`.

## API

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Crea una cuenta. |
| `POST` | `/api/auth/login` | Inicia sesión (cookie `fif_session`). |
| `POST` | `/api/auth/logout` | Cierra la sesión. |
| `GET` | `/api/auth/me` | Usuario actual y lista de usuarios. |
| `GET` / `POST` | `/api/productos` | Lista productos (filtros `?categoria=` y `?q=`) / crea una publicación. |
| `GET` / `PUT` / `DELETE` | `/api/productos/[id]` | Detalle / edita o marca como vendido / elimina. |
| `GET` / `POST` | `/api/favoritos` | Favoritos del usuario / agrega o quita uno. |

## Solución de problemas

**`library load disallowed by system policy` o `ERR_DLOPEN_FAILED` (macOS).** Pasa cuando el proyecto se copia por AirDrop o se descarga como ZIP: macOS marca `node_modules` en cuarentena y bloquea los módulos nativos (`better-sqlite3`, Tailwind, Turbopack). La solución es clonar el repositorio con `git clone` y ejecutar `npm ci`, o bien reinstalar las dependencias:

```bash
rm -rf node_modules && npm ci
```

**El puerto 3000 está ocupado.** Usa otro puerto con `npm run dev -- -p 3001`.

## Limitaciones conocidas

- La cookie de sesión guarda el id del usuario sin firmar, por lo que podría falsificarse. Para producción convendría usar un token firmado (por ejemplo, JWT) o sesiones en el servidor.
- Los endpoints `PUT` y `DELETE` de `/api/productos/[id]` no verifican que quien hace la petición sea el dueño de la publicación.
- Las fotos que suben los usuarios se guardan en Base64 dentro de la base de datos, lo que la hace crecer rápido. Lo ideal sería guardarlas como archivos o en un almacenamiento de objetos.
