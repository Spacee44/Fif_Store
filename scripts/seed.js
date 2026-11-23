const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'fif_store.db');
const SQL_PATH = path.join(__dirname, '..', 'fif_store.sql');

// Si existe la BD anterior, la recreamos para asegurar los 100 registros limpios
if (fs.existsSync(DB_PATH)) {
  try {
    fs.unlinkSync(DB_PATH);
  } catch (e) {
    console.log('No se pudo borrar BD anterior, sobrescribiendo tablas...');
  }
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 1. Crear Esquema
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    carrera TEXT NOT NULL DEFAULT 'Ing. en Software',
    telefono TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    categoria TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    vendedor_id TEXT NOT NULL,
    vendido INTEGER NOT NULL DEFAULT 0,
    imagenes TEXT NOT NULL DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id TEXT NOT NULL,
    producto_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, producto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
  CREATE INDEX IF NOT EXISTS idx_productos_vendedor ON productos(vendedor_id);
  CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);
`);

// 2. Preparar Usuarios
const defaultPasswordHash = bcrypt.hashSync('password123', 10);

const usuarios = [
  {
    id: 'u1',
    nombre: 'Alan Rubio',
    carrera: 'Ing. en Software',
    telefono: '4421234567',
    correo: 'alan.rubio@uaq.edu.mx',
    password: defaultPasswordHash,
  },
  {
    id: 'u2',
    nombre: 'Josue Castillo',
    carrera: 'Ing. en Software',
    telefono: '4427654321',
    correo: 'josue.castillo@uaq.edu.mx',
    password: defaultPasswordHash,
  },
  {
    id: 'u3',
    nombre: 'Daniel Fort',
    carrera: 'Ing. en Software',
    telefono: '4421112233',
    correo: 'daniel.fort@uaq.edu.mx',
    password: defaultPasswordHash,
  },
  {
    id: 'u4',
    nombre: 'Sofia Morales',
    carrera: 'Lic. en Informática',
    telefono: '4423334455',
    correo: 'sofia.morales@uaq.edu.mx',
    password: defaultPasswordHash,
  },
  {
    id: 'u5',
    nombre: 'Carlos Mendoza',
    carrera: 'Ing. en Telecomunicaciones',
    telefono: '4428889900',
    correo: 'carlos.mendoza@uaq.edu.mx',
    password: defaultPasswordHash,
  },
];

const insertUser = db.prepare(`
  INSERT INTO usuarios (id, nombre, carrera, telefono, correo, password)
  VALUES (@id, @nombre, @carrera, @telefono, @correo, @password)
`);

usuarios.forEach((u) => insertUser.run(u));
console.log(`✓ Insertados ${usuarios.length} usuarios iniciales.`);

// 3. Catálogo de 100 productos. Imágenes locales en public/images/productos
//    (fuentes y licencias en CREDITOS_IMAGENES.md)

const rawProductos = [
  // ==================== PAPAS (17 productos) ====================
  {
    nombre: 'Takis Fuego 240g',
    precio: 25,
    categoria: 'Papas',
    descripcion: 'Bolsa grande de Takis Fuego, totalmente cerrada. Entrego en edificio C o biblioteca.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/001-takis-fuego-240g.jpg',
  },
  {
    nombre: 'Ruffles Queso 185g',
    precio: 22,
    categoria: 'Papas',
    descripcion: 'Ruffles sabor a queso, crujientes y frescas. Entrego en la entrada de la FIF.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/002-ruffles-queso-185g.jpg',
  },
  {
    nombre: 'Doritos Nacho 245g',
    precio: 24,
    categoria: 'Papas',
    descripcion: 'Bolsa rendidora de Doritos Nacho. Ideales para la botana entre clases.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/003-doritos-nacho-245g.jpg',
  },
  {
    nombre: 'Chidas Jalapeño',
    precio: 25,
    categoria: 'Papas',
    descripcion: 'Papas Chidas sabor jalapeño bien picositas. Paquete nuevo.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/004-chidas-jalapeno.jpg',
  },
  {
    nombre: 'Chidas Adobadas 250g',
    precio: 25,
    categoria: 'Papas',
    descripcion: 'Chidas sabor adobo de 250g, recién compradas en mayoreo.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/005-chidas-adobadas-250g.jpg',
  },
  {
    nombre: 'Cheetos Torciditos 150g',
    precio: 18,
    categoria: 'Papas',
    descripcion: 'Cheetos sabor queso y chile torciditos. Vendo en laboratorio de cómputo.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/006-cheetos-torciditos-150g.jpg',
  },
  {
    nombre: 'Cheetos Flamin Hot 160g',
    precio: 20,
    categoria: 'Papas',
    descripcion: 'Cheetos Flamin Hot con extra picante. Tengo 3 bolsas disponibles.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/007-cheetos-flamin-hot-160g.jpg',
  },
  {
    nombre: 'Sabritas Sal Clásicas 170g',
    precio: 22,
    categoria: 'Papas',
    descripcion: 'Las clásicas papas Sabritas amarillas con sal. Perfectas con salsa y limón.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/008-sabritas-sal-clasicas-170g.jpg',
  },
  {
    nombre: 'Sabritas Crema y Especias',
    precio: 23,
    categoria: 'Papas',
    descripcion: 'Papas fritas sabor crema y especias, bolsa mediana.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/009-sabritas-crema-y-especias.jpg',
  },
  {
    nombre: 'Chips Fuego Barcel 170g',
    precio: 24,
    categoria: 'Papas',
    descripcion: 'Chips artesanales Barcel corte grueso sabor fuego.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/010-chips-fuego-barcel-170g.jpg',
  },
  {
    nombre: 'Chips Jalapeño Barcel 170g',
    precio: 24,
    categoria: 'Papas',
    descripcion: 'Chips Barcel con chile jalapeño auténtico. Muy crujientes.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/011-chips-jalapeno-barcel-170g.jpg',
  },
  {
    nombre: 'Papas Caseras con Salsa y Limón',
    precio: 20,
    categoria: 'Papas',
    descripcion: 'Papas naturales fritas hechas en casa hoy en la mañana, incluye salsa Botanera.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/012-papas-caseras-con-salsa-y-limon.jpg',
  },
  {
    nombre: 'Doritos Dinamita Chile y Limón',
    precio: 20,
    categoria: 'Papas',
    descripcion: 'Totopos enrollados súper crujientes con limón y chile.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/013-doritos-dinamita-chile-y-limon.jpg',
  },
  {
    nombre: 'Runners Barcel 180g',
    precio: 19,
    categoria: 'Papas',
    descripcion: 'Botana de maíz en forma de coche con salsa picante.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/014-runners-barcel-180g.jpg',
  },
  {
    nombre: 'Papas Pringles Original 124g',
    precio: 38,
    categoria: 'Papas',
    descripcion: 'Tubo de Pringles Original clásico cerrado sellado.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/015-papas-pringles-original-124g.jpg',
  },
  {
    nombre: 'Papas Pringles Sour Cream & Onion',
    precio: 38,
    categoria: 'Papas',
    descripcion: 'Tubo de Pringles crema y cebolla, recién importado.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/016-papas-pringles-sour-cream-y-onion.jpg',
  },
  {
    nombre: 'Tostitos Salsa Verde 240g',
    precio: 23,
    categoria: 'Papas',
    descripcion: 'Tostitos con toque de salsa verde, listos para preparar con cueritos.',
    vendedor_id: 'u1',
    vendido: 1,
    img: '/images/productos/017-tostitos-salsa-verde-240g.jpg',
  },

  // ==================== GALLETAS (17 productos) ====================
  {
    nombre: 'Emperador Chocolate 101g',
    precio: 18,
    categoria: 'Galletas',
    descripcion: 'Paquete de galletas Emperador con relleno sabor chocolate.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/018-emperador-chocolate-101g.jpg',
  },
  {
    nombre: 'Emperador Limón 101g',
    precio: 18,
    categoria: 'Galletas',
    descripcion: 'Galletas tipo sándwich con relleno ácido y dulce sabor a limón.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/019-emperador-limon-101g.jpg',
  },
  {
    nombre: 'Emperador Combinado 101g',
    precio: 18,
    categoria: 'Galletas',
    descripcion: 'Emperador mitad vainilla y mitad chocolate.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/020-emperador-combinado-101g.jpg',
  },
  {
    nombre: 'Chokis Clásicas 84g',
    precio: 19,
    categoria: 'Galletas',
    descripcion: 'Galletas con chispas sabor a chocolate que se deshacen en la boca.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/021-chokis-clasicas-84g.jpg',
  },
  {
    nombre: 'Chokis Brownie 76g',
    precio: 20,
    categoria: 'Galletas',
    descripcion: 'Galletas Chokis rellenas de suave crema de brownie.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/022-chokis-brownie-76g.jpg',
  },
  {
    nombre: 'Oreo Original 114g',
    precio: 19,
    categoria: 'Galletas',
    descripcion: 'Paquete de 10 galletas Oreo con su clásica crema de vainilla.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/023-oreo-original-114g.jpg',
  },
  {
    nombre: 'Oreo Doble Crema 120g',
    precio: 22,
    categoria: 'Galletas',
    descripcion: 'Oreo con el doble de crema dulce. Paquete individual.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/024-oreo-doble-crema-120g.jpg',
  },
  {
    nombre: 'Brownies Caseros con Nuez',
    precio: 25,
    categoria: 'Galletas',
    descripcion: 'Brownies artesanales horneados esta mañana con chocolate amargo y nuez.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/025-brownies-caseros-con-nuez.jpg',
  },
  {
    nombre: 'Canelitas Gamesa 120g',
    precio: 17,
    categoria: 'Galletas',
    descripcion: 'Galletas crujientes con canela y azúcar espolvoreada.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/026-canelitas-gamesa-120g.jpg',
  },
  {
    nombre: 'Polvorones Naranja Gamesa 113g',
    precio: 17,
    categoria: 'Galletas',
    descripcion: 'Polvorones tradicionales con sabor a naranja.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/027-polvorones-naranja-gamesa-113g.jpg',
  },
  {
    nombre: 'Galletas Marías Gamesa 170g',
    precio: 15,
    categoria: 'Galletas',
    descripcion: 'Rollo de galletas Marías ideales para acompañar con café o té.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/028-galletas-marias-gamesa-170g.jpg',
  },
  {
    nombre: 'Príncipe Marinela Chocolate 106g',
    precio: 18,
    categoria: 'Galletas',
    descripcion: 'Galletas rellenas de abundante chocolate suave.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/029-principe-marinela-chocolate-106g.jpg',
  },
  {
    nombre: 'Barritas Marinela Fresa 75g',
    precio: 16,
    categoria: 'Galletas',
    descripcion: 'Dos barritas horneadas con relleno dulce de mermelada de fresa.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/030-barritas-marinela-fresa-75g.jpg',
  },
  {
    nombre: 'Barritas Marinela Piña 75g',
    precio: 16,
    categoria: 'Galletas',
    descripcion: 'Dos barritas con dulce relleno de piña y masa suave.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/031-barritas-marinela-pina-75g.jpg',
  },
  {
    nombre: 'Triki Trakes Marinela 86g',
    precio: 17,
    categoria: 'Galletas',
    descripcion: 'Galletas con chispas crujientes de chocolate.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/032-triki-trakes-marinela-86g.jpg',
  },
  {
    nombre: 'Galletas Piruetas Gamesa 100g',
    precio: 17,
    categoria: 'Galletas',
    descripcion: 'Galletas sándwich rellenas de crema con sabor a limón.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/033-galletas-piruetas-gamesa-100g.jpg',
  },
  {
    nombre: 'Wafers Vainilla Bauducco 140g',
    precio: 20,
    categoria: 'Galletas',
    descripcion: 'Obleas crujientes con tres capas de relleno sabor vainilla.',
    vendedor_id: 'u3',
    vendido: 1,
    img: '/images/productos/034-wafers-vainilla-bauducco-140g.jpg',
  },

  // ==================== GOMITAS (17 productos) ====================
  {
    nombre: 'Panditas Clásicos Ricolino 65g',
    precio: 14,
    categoria: 'Gomitas',
    descripcion: 'Gomitas en forma de osito con sabores frutales clásicos.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/035-panditas-clasicos-ricolino-65g.jpg',
  },
  {
    nombre: 'Panditas Enchilados 65g',
    precio: 15,
    categoria: 'Gomitas',
    descripcion: 'Ositos de gomita cubiertos de chile en polvo agridulce.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/036-panditas-enchilados-65g.jpg',
  },
  {
    nombre: 'Gusanos Ácidos Trolli 100g',
    precio: 20,
    categoria: 'Gomitas',
    descripcion: 'Gusanitos bicolor con cubierta ácida súper intensa.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/037-gusanos-acidos-trolli-100g.jpg',
  },
  {
    nombre: 'Gomitas Enchiladas de Mango',
    precio: 18,
    categoria: 'Gomitas',
    descripcion: 'Rebanadas de gomita sabor mango con chamoy y chile miguelito casero.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/038-gomitas-enchiladas-de-mango.jpg',
  },
  {
    nombre: 'Aros de Durazno Ácidos 90g',
    precio: 16,
    categoria: 'Gomitas',
    descripcion: 'Aros de gomita sabor durazno azucarados.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/039-aros-de-durazno-acidos-90g.jpg',
  },
  {
    nombre: 'Skwinkles Salsagheti Sandía',
    precio: 16,
    categoria: 'Gomitas',
    descripcion: 'Tiras de caramelo suave sabor sandía con salsa líquida sabor tamarindo Gusano.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/040-skwinkles-salsagheti-sandia.jpg',
  },
  {
    nombre: 'Skwinkles Rellenos Piña 26g',
    precio: 15,
    categoria: 'Gomitas',
    descripcion: 'Tubitos de gomita sabor piña rellenos de tamarindo con chile.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/041-skwinkles-rellenos-pina-26g.jpg',
  },
  {
    nombre: 'Skwinkles Clásicos Tamarindo',
    precio: 15,
    categoria: 'Gomitas',
    descripcion: 'Tiras enchiladas sabor tamarindo con sobre de salsa picante.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/042-skwinkles-clasicos-tamarindo.jpg',
  },
  {
    nombre: 'Gomitas Dientes Trolli 80g',
    precio: 18,
    categoria: 'Gomitas',
    descripcion: 'Divertidas gomitas con forma de dentadura sabor fresa y nata.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/043-gomitas-dientes-trolli-80g.jpg',
  },
  {
    nombre: 'Gomitas Moras Silvestres 90g',
    precio: 17,
    categoria: 'Gomitas',
    descripcion: 'Gomitas cubiertas de bolitas crujientes sabor mora roja y negra.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/044-gomitas-moras-silvestres-90g.jpg',
  },
  {
    nombre: 'Gomitas Frutitas Agridulces 100g',
    precio: 18,
    categoria: 'Gomitas',
    descripcion: 'Plátanos, fresas y manzanas de gomita con toque acidito.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/045-gomitas-frutitas-agridulces-100g.jpg',
  },
  {
    nombre: 'Gomitas Sandía con Chile 100g',
    precio: 19,
    categoria: 'Gomitas',
    descripcion: 'Gomitas triangulares sabor sandía espolvoreadas con tajín.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/046-gomitas-sandia-con-chile-100g.jpg',
  },
  {
    nombre: 'Gomitas Tiburones Azules Trolli',
    precio: 20,
    categoria: 'Gomitas',
    descripcion: 'Tiburones de gomita sabor moras y crema.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/047-gomitas-tiburones-azules-trolli.jpg',
  },
  {
    nombre: 'Gomitas Hamburguesa Trolli',
    precio: 12,
    categoria: 'Gomitas',
    descripcion: 'Mini hamburguesa de varias capas de gomitas frutales.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/048-gomitas-hamburguesa-trolli.jpg',
  },
  {
    nombre: 'Gomitas Pulpos Ácidos 90g',
    precio: 18,
    categoria: 'Gomitas',
    descripcion: 'Pulpitos de gomita de varios tentáculos bien ácidos.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/049-gomitas-pulpos-acidos-90g.jpg',
  },
  {
    nombre: 'Gomitas Cerezas Gemelas 90g',
    precio: 17,
    categoria: 'Gomitas',
    descripcion: 'Cerezas de gomita con tallo verde sabor cereza dulce.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/050-gomitas-cerezas-gemelas-90g.jpg',
  },
  {
    nombre: 'Gomitas Fritas Botana Mix 120g',
    precio: 22,
    categoria: 'Gomitas',
    descripcion: 'Mix de gomitas variadas preparadas con salsa valentina y chamoy casero.',
    vendedor_id: 'u1',
    vendido: 1,
    img: '/images/productos/051-gomitas-fritas-botana-mix-120g.jpg',
  },

  // ==================== BEBIDAS (17 productos) ====================
  {
    nombre: 'Coca-Cola 600ml Fría',
    precio: 22,
    categoria: 'Bebidas',
    descripcion: 'Botella de Coca-Cola original bien helada. Entrego en salón C02 o terraza.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/052-coca-cola-600ml-fria.jpg',
  },
  {
    nombre: 'Coca-Cola Sin Azúcar 600ml',
    precio: 22,
    categoria: 'Bebidas',
    descripcion: 'Coca-Cola Zero azúcar 600ml bien fría.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/053-coca-cola-sin-azucar-600ml.png',
  },
  {
    nombre: 'Red Bull Energy Drink 250ml',
    precio: 45,
    categoria: 'Bebidas',
    descripcion: 'Lata de Red Bull helada para sobrevivir a la semana de exámenes.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/054-red-bull-energy-drink-250ml.jpg',
  },
  {
    nombre: 'Monster Energy Mango Loco 473ml',
    precio: 42,
    categoria: 'Bebidas',
    descripcion: 'Lata grande de Monster Juice sabor Mango Loco frío.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/055-monster-energy-mango-loco-473ml.jpg',
  },
  {
    nombre: 'Monster Energy Ultra White 473ml',
    precio: 42,
    categoria: 'Bebidas',
    descripcion: 'Monster Ultra sin azúcar sabor cítrico bien helado.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/056-monster-energy-ultra-white-473ml.jpg',
  },
  {
    nombre: 'Arizona Green Tea con Miel 680ml',
    precio: 25,
    categoria: 'Bebidas',
    descripcion: 'Lata grande de té verde Arizona con miel y ginseng. Bien fría.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/057-arizona-green-tea-con-miel-680ml.jpg',
  },
  {
    nombre: 'Arizona Sandia Mucho Mango 680ml',
    precio: 25,
    categoria: 'Bebidas',
    descripcion: 'Lata de Arizona sabor Mucho Mango, refrescante para la tarde.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/058-arizona-sandia-mucho-mango-680ml.jpg',
  },
  {
    nombre: 'Boing de Guayaba 500ml',
    precio: 18,
    categoria: 'Bebidas',
    descripcion: 'Jugo Boing en envase de vidrio frío, el favorito de la cafetería.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/059-boing-de-guayaba-500ml.jpg',
  },
  {
    nombre: 'Boing de Mango 500ml',
    precio: 18,
    categoria: 'Bebidas',
    descripcion: 'Boing de pulpa de mango natural en vidrio, bien frío.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/060-boing-de-mango-500ml.jpg',
  },
  {
    nombre: 'Agua Ciel Purificada 1 Litro',
    precio: 15,
    categoria: 'Bebidas',
    descripcion: 'Botella de 1 litro de agua Ciel purificada.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/061-agua-ciel-purificada-1-litro.jpg',
  },
  {
    nombre: 'Agua Bonafont Levité Fresa 1L',
    precio: 20,
    categoria: 'Bebidas',
    descripcion: 'Agua infusionada con sabor ligero a fresa natural.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/062-agua-bonafont-levite-fresa-1l.jpg',
  },
  {
    nombre: 'Café Frío Americano con Hielo',
    precio: 25,
    categoria: 'Bebidas',
    descripcion: 'Vaso de café frío recién preparado con grano de Chiapas.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/063-cafe-frio-americano-con-hielo.jpg',
  },
  {
    nombre: 'Iced Latte Vainilla 400ml',
    precio: 35,
    categoria: 'Bebidas',
    descripcion: 'Café espresso con leche entera y jarabe de vainilla con hielo.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/064-iced-latte-vainilla-400ml.jpg',
  },
  {
    nombre: 'Jarritos Mandarina 600ml',
    precio: 18,
    categoria: 'Bebidas',
    descripcion: 'Refresco mexicano tradicional sabor mandarina con gas bien helado.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/065-jarritos-mandarina-600ml.jpg',
  },
  {
    nombre: 'Sprite 600ml Lima-Limón',
    precio: 22,
    categoria: 'Bebidas',
    descripcion: 'Refresco Sprite 600ml bien frío.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/066-sprite-600ml-lima-limon.jpg',
  },
  {
    nombre: 'Electrolit Coco 625ml',
    precio: 32,
    categoria: 'Bebidas',
    descripcion: 'Suero oral rehidratante sabor coco, ideal para reponer energía.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/067-electrolit-coco-625ml.jpg',
  },
  {
    nombre: 'Jugo del Valle Manzana 413ml',
    precio: 19,
    categoria: 'Bebidas',
    descripcion: 'Néctar clarificado de manzana Del Valle en botella Pet.',
    vendedor_id: 'u3',
    vendido: 1,
    img: '/images/productos/068-jugo-del-valle-manzana-413ml.jpg',
  },

  // ==================== DULCES (16 productos) ====================
  {
    nombre: 'Mazapán De la Rosa Gigante 50g',
    precio: 10,
    categoria: 'Dulces',
    descripcion: 'El auténtico mazapán de cacahuate que no se rompe si tienes suerte.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/069-mazapan-de-la-rosa-gigante-50g.jpg',
  },
  {
    nombre: 'Mazapán Cubierto de Chocolate',
    precio: 14,
    categoria: 'Dulces',
    descripcion: 'Mazapán De la Rosa bañado en deliciosa cobertura de chocolate.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/070-mazapan-cubierto-de-chocolate.jpg',
  },
  {
    nombre: 'Pelón Pelo Rico 30g',
    precio: 12,
    categoria: 'Dulces',
    descripcion: 'Caramelo suave sabor tamarindo para empujar.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/071-pelon-pelo-rico-30g.jpg',
  },
  {
    nombre: 'Paleta Payaso Ricolino 45g',
    precio: 18,
    categoria: 'Dulces',
    descripcion: 'Bombón esponjoso cubierto con chocolate y gomitas de cara sonriente.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/072-paleta-payaso-ricolino-45g.jpg',
  },
  {
    nombre: 'Duvalín Avellana y Vainilla',
    precio: 8,
    categoria: 'Dulces',
    descripcion: 'Untable cremoso bicromatico con cucharita plástica incluida.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/073-duvalin-avellana-y-vainilla.jpg',
  },
  {
    nombre: 'Pulparindo Clásico De la Rosa',
    precio: 7,
    categoria: 'Dulces',
    descripcion: 'Barrita de pulpa de tamarindo natural salado y enchilado.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/074-pulparindo-clasico-de-la-rosa.jpg',
  },
  {
    nombre: 'Pulparindo Gigante Extra Picante',
    precio: 12,
    categoria: 'Dulces',
    descripcion: 'Pulparindo tamaño doble con extra chile habanero.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/075-pulparindo-gigante-extra-picante.jpg',
  },
  {
    nombre: 'Kranky Ricolino 40g',
    precio: 16,
    categoria: 'Dulces',
    descripcion: 'Hojuelas de maíz tostadas y crujientes cubiertas de chocolate.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/076-kranky-ricolino-40g.jpg',
  },
  {
    nombre: 'Bubu Lubu Ricolino 35g',
    precio: 14,
    categoria: 'Dulces',
    descripcion: 'Malvavisco con jalea sabor fresa y cubierta de chocolate frío.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/077-bubu-lubu-ricolino-35g.jpg',
  },
  {
    nombre: 'Chocolate Carlos V 18g',
    precio: 12,
    categoria: 'Dulces',
    descripcion: 'El rey de los chocolates con leche suizo-mexicano.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/078-chocolate-carlos-v-18g.jpg',
  },
  {
    nombre: 'Snickers Barra 52g',
    precio: 22,
    categoria: 'Dulces',
    descripcion: 'Chocolate con relleno de caramelo, turrón y cacahuates tostados.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/079-snickers-barra-52g.jpg',
  },
  {
    nombre: 'Kinder Bueno 43g',
    precio: 28,
    categoria: 'Dulces',
    descripcion: 'Dos barritas crujientes con barquillo relleno de crema de avellanas.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/080-kinder-bueno-43g.jpg',
  },
  {
    nombre: 'Lucas Muecas Chamoy',
    precio: 15,
    categoria: 'Dulces',
    descripcion: 'Paleta sabor caramelo con chile en polvo en contenedor plástico.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/081-lucas-muecas-chamoy.jpg',
  },
  {
    nombre: 'Rockaleta Paleta de Caramelo',
    precio: 10,
    categoria: 'Dulces',
    descripcion: 'Paleta con 4 capas de chiles de colores y centro de goma de mascar.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/082-rockaleta-paleta-de-caramelo.jpg',
  },
  {
    nombre: 'Tamborines Enchilados 50g',
    precio: 14,
    categoria: 'Dulces',
    descripcion: 'Dulce suave de tamarindo con sal y chile en forma de tambor.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/083-tamborines-enchilados-50g.jpg',
  },
  {
    nombre: 'Ferrero Rocher paquete de 3',
    precio: 35,
    categoria: 'Dulces',
    descripcion: 'Bombones finos de avellana entera tostada envueltos en dorada presentación.',
    vendedor_id: 'u2',
    vendido: 1,
    img: '/images/productos/084-ferrero-rocher-paquete-de-3.jpg',
  },

  // ==================== COMIDA (16 productos) ====================
  {
    nombre: 'Rebanada de Pizza Pepperoni',
    precio: 25,
    categoria: 'Comida',
    descripcion: 'Rebanada grande de Little Caesars calientita con extra queso y pepperoni.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/085-rebanada-de-pizza-pepperoni.jpg',
  },
  {
    nombre: 'Rebanada de Pizza Tres Quesos',
    precio: 25,
    categoria: 'Comida',
    descripcion: 'Pizza con mozzarella, provolone y parmesano crujiente.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/086-rebanada-de-pizza-tres-quesos.jpg',
  },
  {
    nombre: 'Torta de Milanesa con Queso',
    precio: 45,
    categoria: 'Comida',
    descripcion: 'Torta en telera con milanesa de pollo empanizada, frijoles, quesillo y aguacate.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/087-torta-de-milanesa-con-queso.jpg',
  },
  {
    nombre: 'Torta de Jamón y Queso Panela',
    precio: 35,
    categoria: 'Comida',
    descripcion: 'Torta fresca con mayonesa, jitomate, lechuga y chiles en vinagre.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/088-torta-de-jamon-y-queso-panela.jpg',
  },
  {
    nombre: 'Burrito de Bistec con Queso',
    precio: 40,
    categoria: 'Comida',
    descripcion: 'Burrito norteño en tortilla de harina grande con bistec asado y queso gouda.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/089-burrito-de-bistec-con-queso.jpg',
  },
  {
    nombre: 'Burrito de Chicharrón Prensado',
    precio: 38,
    categoria: 'Comida',
    descripcion: 'Burrito relleno de chicharrón prensado guisado en salsa verde.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/090-burrito-de-chicharron-prensado.jpg',
  },
  {
    nombre: 'Sándwich Clásico de Pavo',
    precio: 30,
    categoria: 'Comida',
    descripcion: 'Pan integral con pechuga de pavo, queso manchego, lechuga y aderezo especial.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/091-sandwich-clasico-de-pavo.jpg',
  },
  {
    nombre: 'Club Sándwich Triple con Papas',
    precio: 55,
    categoria: 'Comida',
    descripcion: 'Tres pisos de sándwich con tocino, pollo, jamón, queso y papas fritas.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/092-club-sandwich-triple-con-papas.jpg',
  },
  {
    nombre: 'Orden de Molletes con Frijol y Queso',
    precio: 35,
    categoria: 'Comida',
    descripcion: 'Dos mitades de bolillo con frijoles refritos, queso gratinado y pico de gallo.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/093-orden-de-molletes-con-frijol-y-queso.jpg',
  },
  {
    nombre: 'Hot Dog Especial con Tocino',
    precio: 30,
    categoria: 'Comida',
    descripcion: 'Salchicha de pavo envuelta en tocino crujiente, jitomate, cebolla y aderezos.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/094-hot-dog-especial-con-tocino.jpg',
  },
  {
    nombre: 'Quesadilla Gigante en Harina con Bistec',
    precio: 42,
    categoria: 'Comida',
    descripcion: 'Tortilla de harina de 30cm doblada a la mitad con queso Oaxaca y bistec.',
    vendedor_id: 'u1',
    vendido: 0,
    img: '/images/productos/095-quesadilla-gigante-en-harina-con-bistec.jpg',
  },
  {
    nombre: 'Orden de 3 Tacos al Pastor',
    precio: 45,
    categoria: 'Comida',
    descripcion: 'Tres tacos de carne al pastor con piña, cilantro, cebolla y salsa taquera.',
    vendedor_id: 'u2',
    vendido: 0,
    img: '/images/productos/096-orden-de-3-tacos-al-pastor.jpg',
  },
  {
    nombre: 'Sushi Roll California (8 piezas)',
    precio: 60,
    categoria: 'Comida',
    descripcion: 'Rollo empanizado de surimi, queso crema y aguacate con salsa chipotle y soya.',
    vendedor_id: 'u3',
    vendido: 0,
    img: '/images/productos/097-sushi-roll-california-8-piezas.jpg',
  },
  {
    nombre: 'Hamburguesa con Queso y Tocino',
    precio: 50,
    categoria: 'Comida',
    descripcion: 'Carne 100% res asada, queso americano, tocino crujiente, lechuga y tomate.',
    vendedor_id: 'u4',
    vendido: 0,
    img: '/images/productos/098-hamburguesa-con-queso-y-tocino.jpg',
  },
  {
    nombre: 'Ensalada César con Pollo Asado',
    precio: 48,
    categoria: 'Comida',
    descripcion: 'Lechuga orejona fresca, pechuga de pollo a la plancha, crutones y aderezo césar.',
    vendedor_id: 'u5',
    vendido: 0,
    img: '/images/productos/099-ensalada-cesar-con-pollo-asado.jpg',
  },
  {
    nombre: 'Sincronizada con Jamón y Doble Queso',
    precio: 28,
    categoria: 'Comida',
    descripcion: 'Dos tortillas de harina con jamón de pavo y abundante queso fundido.',
    vendedor_id: 'u1',
    vendido: 1,
    img: '/images/productos/100-sincronizada-con-jamon-y-doble-queso.jpg',
  },
];

console.log(`Catálogo preparado con ${rawProductos.length} registros.`);

const insertProducto = db.prepare(`
  INSERT INTO productos (id, nombre, precio, categoria, descripcion, vendedor_id, vendido, imagenes)
  VALUES (@id, @nombre, @precio, @categoria, @descripcion, @vendedor_id, @vendido, @imagenes)
`);

const insertFavorito = db.prepare(`
  INSERT INTO favoritos (usuario_id, producto_id)
  VALUES (?, ?)
`);

db.transaction(() => {
  rawProductos.forEach((p, index) => {
    const id = index + 1;
    insertProducto.run({
      id,
      nombre: p.nombre,
      precio: p.precio,
      categoria: p.categoria,
      descripcion: p.descripcion,
      vendedor_id: p.vendedor_id,
      vendido: p.vendido,
      imagenes: JSON.stringify([p.img]),
    });
  });

  // Favoritos iniciales para pruebas
  [1, 3, 5, 18, 35, 52, 69, 85].forEach((prodId) => {
    insertFavorito.run('u1', prodId);
  });
})();

console.log(`✓ Insertados exactamente ${rawProductos.length} productos en la base de datos.`);

// 4. Generar Script SQL para DBAs (DBeaver, MySQL, SQLite, PostgreSQL)
let sqlDump = `-- =====================================================================
-- FIF STORE - DUMP OFICIAL DE BASE DE DATOS
-- Compatible con: SQLite, DBeaver, TablePlus, MySQL, PostgreSQL
-- Total de productos: 100 registros con imágenes locales (public/images/productos)
-- =====================================================================

DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id VARCHAR(64) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  carrera VARCHAR(100) NOT NULL DEFAULT 'Ing. en Software',
  telefono VARCHAR(20) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
  id INTEGER PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  vendedor_id VARCHAR(64) NOT NULL,
  vendido INT NOT NULL DEFAULT 0,
  imagenes TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE favoritos (
  id INTEGER PRIMARY KEY,
  usuario_id VARCHAR(64) NOT NULL,
  producto_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, producto_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_vendedor ON productos(vendedor_id);
CREATE INDEX idx_favoritos_usuario ON favoritos(usuario_id);

-- ---------------------------------------------------------------------
-- INSERCIONES DE USUARIOS (Contraseña de prueba: password123)
-- ---------------------------------------------------------------------
`;

usuarios.forEach((u) => {
  sqlDump += `INSERT INTO usuarios (id, nombre, carrera, telefono, correo, password) VALUES ('${u.id}', '${u.nombre.replace(/'/g, "''")}', '${u.carrera.replace(/'/g, "''")}', '${u.telefono}', '${u.correo}', '${u.password}');\n`;
});

sqlDump += `\n-- ---------------------------------------------------------------------\n-- INSERCIONES DE 100 PRODUCTOS CON IMÁGENES LOCALES\n-- ---------------------------------------------------------------------\n`;

rawProductos.forEach((p, index) => {
  const id = index + 1;
  const imgsJson = JSON.stringify([p.img]).replace(/'/g, "''");
  const desc = p.descripcion.replace(/'/g, "''");
  const nom = p.nombre.replace(/'/g, "''");
  sqlDump += `INSERT INTO productos (id, nombre, precio, categoria, descripcion, vendedor_id, vendido, imagenes) VALUES (${id}, '${nom}', ${p.precio}, '${p.categoria}', '${desc}', '${p.vendedor_id}', ${p.vendido}, '${imgsJson}');\n`;
});

sqlDump += `\n-- ---------------------------------------------------------------------\n-- INSERCIONES DE FAVORITOS INICIALES\n-- ---------------------------------------------------------------------\n`;
[1, 3, 5, 18, 35, 52, 69, 85].forEach((prodId) => {
  sqlDump += `INSERT INTO favoritos (usuario_id, producto_id) VALUES ('u1', ${prodId});\n`;
});

fs.writeFileSync(SQL_PATH, sqlDump, 'utf8');
console.log(`✓ Archivo SQL exportado para DBA en: ${SQL_PATH}`);
