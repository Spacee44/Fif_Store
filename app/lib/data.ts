// Tipos y datos de FIF Store sincronizados con la Base de Datos SQLite.
// Contiene el catálogo completo de 100 productos con imágenes web.

export type Categoria =
  | 'Papas'
  | 'Galletas'
  | 'Gomitas'
  | 'Bebidas'
  | 'Dulces'
  | 'Comida';

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: Categoria;
  descripcion: string;
  vendedorId: string;
  vendido: boolean;
  imagenes: string[];
};

export type Usuario = {
  id: string;
  nombre: string;
  carrera: string;
  telefono: string;
  correo: string;
};

export const CATEGORIAS: Categoria[] = [
  'Papas',
  'Galletas',
  'Gomitas',
  'Bebidas',
  'Dulces',
  'Comida',
];

export const ICONO_CATEGORIA: Record<Categoria, string> = {
  Papas: '/icons/fries.png',
  Galletas: '/icons/cookie.png',
  Gomitas: '/icons/candy.png',
  Bebidas: '/icons/soda.png',
  Dulces: '/icons/candy.png',
  Comida: '/icons/pizza.png',
};

export const USUARIO_ACTUAL_ID = 'u1';

export const USUARIOS_INICIALES: Usuario[] = [
  {
    "id": "u1",
    "nombre": "Alan Rubio",
    "carrera": "Ing. en Software",
    "telefono": "4421234567",
    "correo": "alan.rubio@uaq.edu.mx"
  },
  {
    "id": "u2",
    "nombre": "Josue Castillo",
    "carrera": "Ing. en Software",
    "telefono": "4427654321",
    "correo": "josue.castillo@uaq.edu.mx"
  },
  {
    "id": "u3",
    "nombre": "Daniel Fort",
    "carrera": "Ing. en Software",
    "telefono": "4421112233",
    "correo": "daniel.fort@uaq.edu.mx"
  },
  {
    "id": "u4",
    "nombre": "Sofia Morales",
    "carrera": "Lic. en Informática",
    "telefono": "4423334455",
    "correo": "sofia.morales@uaq.edu.mx"
  },
  {
    "id": "u5",
    "nombre": "Carlos Mendoza",
    "carrera": "Ing. en Telecomunicaciones",
    "telefono": "4428889900",
    "correo": "carlos.mendoza@uaq.edu.mx"
  }
];

export const PRODUCTOS_INICIALES: Producto[] = [
  {
    "id": 1,
    "nombre": "Takis Fuego 240g",
    "precio": 25,
    "categoria": "Papas",
    "descripcion": "Bolsa grande de Takis Fuego, totalmente cerrada. Entrego en edificio C o biblioteca.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/001-takis-fuego-240g.jpg"
    ]
  },
  {
    "id": 2,
    "nombre": "Ruffles Queso 185g",
    "precio": 22,
    "categoria": "Papas",
    "descripcion": "Ruffles sabor a queso, crujientes y frescas. Entrego en la entrada de la FIF.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/002-ruffles-queso-185g.jpg"
    ]
  },
  {
    "id": 3,
    "nombre": "Doritos Nacho 245g",
    "precio": 24,
    "categoria": "Papas",
    "descripcion": "Bolsa rendidora de Doritos Nacho. Ideales para la botana entre clases.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/003-doritos-nacho-245g.jpg"
    ]
  },
  {
    "id": 4,
    "nombre": "Chidas Jalapeño",
    "precio": 25,
    "categoria": "Papas",
    "descripcion": "Papas Chidas sabor jalapeño bien picositas. Paquete nuevo.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/004-chidas-jalapeno.jpg"
    ]
  },
  {
    "id": 5,
    "nombre": "Chidas Adobadas 250g",
    "precio": 25,
    "categoria": "Papas",
    "descripcion": "Chidas sabor adobo de 250g, recién compradas en mayoreo.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/005-chidas-adobadas-250g.jpg"
    ]
  },
  {
    "id": 6,
    "nombre": "Cheetos Torciditos 150g",
    "precio": 18,
    "categoria": "Papas",
    "descripcion": "Cheetos sabor queso y chile torciditos. Vendo en laboratorio de cómputo.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/006-cheetos-torciditos-150g.jpg"
    ]
  },
  {
    "id": 7,
    "nombre": "Cheetos Flamin Hot 160g",
    "precio": 20,
    "categoria": "Papas",
    "descripcion": "Cheetos Flamin Hot con extra picante. Tengo 3 bolsas disponibles.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/007-cheetos-flamin-hot-160g.jpg"
    ]
  },
  {
    "id": 8,
    "nombre": "Sabritas Sal Clásicas 170g",
    "precio": 22,
    "categoria": "Papas",
    "descripcion": "Las clásicas papas Sabritas amarillas con sal. Perfectas con salsa y limón.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/008-sabritas-sal-clasicas-170g.jpg"
    ]
  },
  {
    "id": 9,
    "nombre": "Sabritas Crema y Especias",
    "precio": 23,
    "categoria": "Papas",
    "descripcion": "Papas fritas sabor crema y especias, bolsa mediana.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/009-sabritas-crema-y-especias.jpg"
    ]
  },
  {
    "id": 10,
    "nombre": "Chips Fuego Barcel 170g",
    "precio": 24,
    "categoria": "Papas",
    "descripcion": "Chips artesanales Barcel corte grueso sabor fuego.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/010-chips-fuego-barcel-170g.jpg"
    ]
  },
  {
    "id": 11,
    "nombre": "Chips Jalapeño Barcel 170g",
    "precio": 24,
    "categoria": "Papas",
    "descripcion": "Chips Barcel con chile jalapeño auténtico. Muy crujientes.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/011-chips-jalapeno-barcel-170g.jpg"
    ]
  },
  {
    "id": 12,
    "nombre": "Papas Caseras con Salsa y Limón",
    "precio": 20,
    "categoria": "Papas",
    "descripcion": "Papas naturales fritas hechas en casa hoy en la mañana, incluye salsa Botanera.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/012-papas-caseras-con-salsa-y-limon.jpg"
    ]
  },
  {
    "id": 13,
    "nombre": "Doritos Dinamita Chile y Limón",
    "precio": 20,
    "categoria": "Papas",
    "descripcion": "Totopos enrollados súper crujientes con limón y chile.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/013-doritos-dinamita-chile-y-limon.jpg"
    ]
  },
  {
    "id": 14,
    "nombre": "Runners Barcel 180g",
    "precio": 19,
    "categoria": "Papas",
    "descripcion": "Botana de maíz en forma de coche con salsa picante.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/014-runners-barcel-180g.jpg"
    ]
  },
  {
    "id": 15,
    "nombre": "Papas Pringles Original 124g",
    "precio": 38,
    "categoria": "Papas",
    "descripcion": "Tubo de Pringles Original clásico cerrado sellado.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/015-papas-pringles-original-124g.jpg"
    ]
  },
  {
    "id": 16,
    "nombre": "Papas Pringles Sour Cream & Onion",
    "precio": 38,
    "categoria": "Papas",
    "descripcion": "Tubo de Pringles crema y cebolla, recién importado.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/016-papas-pringles-sour-cream-y-onion.jpg"
    ]
  },
  {
    "id": 17,
    "nombre": "Tostitos Salsa Verde 240g",
    "precio": 23,
    "categoria": "Papas",
    "descripcion": "Tostitos con toque de salsa verde, listos para preparar con cueritos.",
    "vendedorId": "u1",
    "vendido": true,
    "imagenes": [
      "/images/productos/017-tostitos-salsa-verde-240g.jpg"
    ]
  },
  {
    "id": 18,
    "nombre": "Emperador Chocolate 101g",
    "precio": 18,
    "categoria": "Galletas",
    "descripcion": "Paquete de galletas Emperador con relleno sabor chocolate.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/018-emperador-chocolate-101g.jpg"
    ]
  },
  {
    "id": 19,
    "nombre": "Emperador Limón 101g",
    "precio": 18,
    "categoria": "Galletas",
    "descripcion": "Galletas tipo sándwich con relleno ácido y dulce sabor a limón.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/019-emperador-limon-101g.jpg"
    ]
  },
  {
    "id": 20,
    "nombre": "Emperador Combinado 101g",
    "precio": 18,
    "categoria": "Galletas",
    "descripcion": "Emperador mitad vainilla y mitad chocolate.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/020-emperador-combinado-101g.jpg"
    ]
  },
  {
    "id": 21,
    "nombre": "Chokis Clásicas 84g",
    "precio": 19,
    "categoria": "Galletas",
    "descripcion": "Galletas con chispas sabor a chocolate que se deshacen en la boca.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/021-chokis-clasicas-84g.jpg"
    ]
  },
  {
    "id": 22,
    "nombre": "Chokis Brownie 76g",
    "precio": 20,
    "categoria": "Galletas",
    "descripcion": "Galletas Chokis rellenas de suave crema de brownie.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/022-chokis-brownie-76g.jpg"
    ]
  },
  {
    "id": 23,
    "nombre": "Oreo Original 114g",
    "precio": 19,
    "categoria": "Galletas",
    "descripcion": "Paquete de 10 galletas Oreo con su clásica crema de vainilla.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/023-oreo-original-114g.jpg"
    ]
  },
  {
    "id": 24,
    "nombre": "Oreo Doble Crema 120g",
    "precio": 22,
    "categoria": "Galletas",
    "descripcion": "Oreo con el doble de crema dulce. Paquete individual.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/024-oreo-doble-crema-120g.jpg"
    ]
  },
  {
    "id": 25,
    "nombre": "Brownies Caseros con Nuez",
    "precio": 25,
    "categoria": "Galletas",
    "descripcion": "Brownies artesanales horneados esta mañana con chocolate amargo y nuez.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/025-brownies-caseros-con-nuez.jpg"
    ]
  },
  {
    "id": 26,
    "nombre": "Canelitas Gamesa 120g",
    "precio": 17,
    "categoria": "Galletas",
    "descripcion": "Galletas crujientes con canela y azúcar espolvoreada.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/026-canelitas-gamesa-120g.jpg"
    ]
  },
  {
    "id": 27,
    "nombre": "Polvorones Naranja Gamesa 113g",
    "precio": 17,
    "categoria": "Galletas",
    "descripcion": "Polvorones tradicionales con sabor a naranja.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/027-polvorones-naranja-gamesa-113g.jpg"
    ]
  },
  {
    "id": 28,
    "nombre": "Galletas Marías Gamesa 170g",
    "precio": 15,
    "categoria": "Galletas",
    "descripcion": "Rollo de galletas Marías ideales para acompañar con café o té.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/028-galletas-marias-gamesa-170g.jpg"
    ]
  },
  {
    "id": 29,
    "nombre": "Príncipe Marinela Chocolate 106g",
    "precio": 18,
    "categoria": "Galletas",
    "descripcion": "Galletas rellenas de abundante chocolate suave.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/029-principe-marinela-chocolate-106g.jpg"
    ]
  },
  {
    "id": 30,
    "nombre": "Barritas Marinela Fresa 75g",
    "precio": 16,
    "categoria": "Galletas",
    "descripcion": "Dos barritas horneadas con relleno dulce de mermelada de fresa.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/030-barritas-marinela-fresa-75g.jpg"
    ]
  },
  {
    "id": 31,
    "nombre": "Barritas Marinela Piña 75g",
    "precio": 16,
    "categoria": "Galletas",
    "descripcion": "Dos barritas con dulce relleno de piña y masa suave.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/031-barritas-marinela-pina-75g.jpg"
    ]
  },
  {
    "id": 32,
    "nombre": "Triki Trakes Marinela 86g",
    "precio": 17,
    "categoria": "Galletas",
    "descripcion": "Galletas con chispas crujientes de chocolate.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/032-triki-trakes-marinela-86g.jpg"
    ]
  },
  {
    "id": 33,
    "nombre": "Galletas Piruetas Gamesa 100g",
    "precio": 17,
    "categoria": "Galletas",
    "descripcion": "Galletas sándwich rellenas de crema con sabor a limón.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/033-galletas-piruetas-gamesa-100g.jpg"
    ]
  },
  {
    "id": 34,
    "nombre": "Wafers Vainilla Bauducco 140g",
    "precio": 20,
    "categoria": "Galletas",
    "descripcion": "Obleas crujientes con tres capas de relleno sabor vainilla.",
    "vendedorId": "u3",
    "vendido": true,
    "imagenes": [
      "/images/productos/034-wafers-vainilla-bauducco-140g.jpg"
    ]
  },
  {
    "id": 35,
    "nombre": "Panditas Clásicos Ricolino 65g",
    "precio": 14,
    "categoria": "Gomitas",
    "descripcion": "Gomitas en forma de osito con sabores frutales clásicos.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/035-panditas-clasicos-ricolino-65g.jpg"
    ]
  },
  {
    "id": 36,
    "nombre": "Panditas Enchilados 65g",
    "precio": 15,
    "categoria": "Gomitas",
    "descripcion": "Ositos de gomita cubiertos de chile en polvo agridulce.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/036-panditas-enchilados-65g.jpg"
    ]
  },
  {
    "id": 37,
    "nombre": "Gusanos Ácidos Trolli 100g",
    "precio": 20,
    "categoria": "Gomitas",
    "descripcion": "Gusanitos bicolor con cubierta ácida súper intensa.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/037-gusanos-acidos-trolli-100g.jpg"
    ]
  },
  {
    "id": 38,
    "nombre": "Gomitas Enchiladas de Mango",
    "precio": 18,
    "categoria": "Gomitas",
    "descripcion": "Rebanadas de gomita sabor mango con chamoy y chile miguelito casero.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/038-gomitas-enchiladas-de-mango.jpg"
    ]
  },
  {
    "id": 39,
    "nombre": "Aros de Durazno Ácidos 90g",
    "precio": 16,
    "categoria": "Gomitas",
    "descripcion": "Aros de gomita sabor durazno azucarados.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/039-aros-de-durazno-acidos-90g.jpg"
    ]
  },
  {
    "id": 40,
    "nombre": "Skwinkles Salsagheti Sandía",
    "precio": 16,
    "categoria": "Gomitas",
    "descripcion": "Tiras de caramelo suave sabor sandía con salsa líquida sabor tamarindo Gusano.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/040-skwinkles-salsagheti-sandia.jpg"
    ]
  },
  {
    "id": 41,
    "nombre": "Skwinkles Rellenos Piña 26g",
    "precio": 15,
    "categoria": "Gomitas",
    "descripcion": "Tubitos de gomita sabor piña rellenos de tamarindo con chile.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/041-skwinkles-rellenos-pina-26g.jpg"
    ]
  },
  {
    "id": 42,
    "nombre": "Skwinkles Clásicos Tamarindo",
    "precio": 15,
    "categoria": "Gomitas",
    "descripcion": "Tiras enchiladas sabor tamarindo con sobre de salsa picante.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/042-skwinkles-clasicos-tamarindo.jpg"
    ]
  },
  {
    "id": 43,
    "nombre": "Gomitas Dientes Trolli 80g",
    "precio": 18,
    "categoria": "Gomitas",
    "descripcion": "Divertidas gomitas con forma de dentadura sabor fresa y nata.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/043-gomitas-dientes-trolli-80g.jpg"
    ]
  },
  {
    "id": 44,
    "nombre": "Gomitas Moras Silvestres 90g",
    "precio": 17,
    "categoria": "Gomitas",
    "descripcion": "Gomitas cubiertas de bolitas crujientes sabor mora roja y negra.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/044-gomitas-moras-silvestres-90g.jpg"
    ]
  },
  {
    "id": 45,
    "nombre": "Gomitas Frutitas Agridulces 100g",
    "precio": 18,
    "categoria": "Gomitas",
    "descripcion": "Plátanos, fresas y manzanas de gomita con toque acidito.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/045-gomitas-frutitas-agridulces-100g.jpg"
    ]
  },
  {
    "id": 46,
    "nombre": "Gomitas Sandía con Chile 100g",
    "precio": 19,
    "categoria": "Gomitas",
    "descripcion": "Gomitas triangulares sabor sandía espolvoreadas con tajín.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/046-gomitas-sandia-con-chile-100g.jpg"
    ]
  },
  {
    "id": 47,
    "nombre": "Gomitas Tiburones Azules Trolli",
    "precio": 20,
    "categoria": "Gomitas",
    "descripcion": "Tiburones de gomita sabor moras y crema.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/047-gomitas-tiburones-azules-trolli.jpg"
    ]
  },
  {
    "id": 48,
    "nombre": "Gomitas Hamburguesa Trolli",
    "precio": 12,
    "categoria": "Gomitas",
    "descripcion": "Mini hamburguesa de varias capas de gomitas frutales.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/048-gomitas-hamburguesa-trolli.jpg"
    ]
  },
  {
    "id": 49,
    "nombre": "Gomitas Pulpos Ácidos 90g",
    "precio": 18,
    "categoria": "Gomitas",
    "descripcion": "Pulpitos de gomita de varios tentáculos bien ácidos.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/049-gomitas-pulpos-acidos-90g.jpg"
    ]
  },
  {
    "id": 50,
    "nombre": "Gomitas Cerezas Gemelas 90g",
    "precio": 17,
    "categoria": "Gomitas",
    "descripcion": "Cerezas de gomita con tallo verde sabor cereza dulce.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/050-gomitas-cerezas-gemelas-90g.jpg"
    ]
  },
  {
    "id": 51,
    "nombre": "Gomitas Fritas Botana Mix 120g",
    "precio": 22,
    "categoria": "Gomitas",
    "descripcion": "Mix de gomitas variadas preparadas con salsa valentina y chamoy casero.",
    "vendedorId": "u1",
    "vendido": true,
    "imagenes": [
      "/images/productos/051-gomitas-fritas-botana-mix-120g.jpg"
    ]
  },
  {
    "id": 52,
    "nombre": "Coca-Cola 600ml Fría",
    "precio": 22,
    "categoria": "Bebidas",
    "descripcion": "Botella de Coca-Cola original bien helada. Entrego en salón C02 o terraza.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/052-coca-cola-600ml-fria.jpg"
    ]
  },
  {
    "id": 53,
    "nombre": "Coca-Cola Sin Azúcar 600ml",
    "precio": 22,
    "categoria": "Bebidas",
    "descripcion": "Coca-Cola Zero azúcar 600ml bien fría.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/053-coca-cola-sin-azucar-600ml.png"
    ]
  },
  {
    "id": 54,
    "nombre": "Red Bull Energy Drink 250ml",
    "precio": 45,
    "categoria": "Bebidas",
    "descripcion": "Lata de Red Bull helada para sobrevivir a la semana de exámenes.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/054-red-bull-energy-drink-250ml.jpg"
    ]
  },
  {
    "id": 55,
    "nombre": "Monster Energy Mango Loco 473ml",
    "precio": 42,
    "categoria": "Bebidas",
    "descripcion": "Lata grande de Monster Juice sabor Mango Loco frío.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/055-monster-energy-mango-loco-473ml.jpg"
    ]
  },
  {
    "id": 56,
    "nombre": "Monster Energy Ultra White 473ml",
    "precio": 42,
    "categoria": "Bebidas",
    "descripcion": "Monster Ultra sin azúcar sabor cítrico bien helado.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/056-monster-energy-ultra-white-473ml.jpg"
    ]
  },
  {
    "id": 57,
    "nombre": "Arizona Green Tea con Miel 680ml",
    "precio": 25,
    "categoria": "Bebidas",
    "descripcion": "Lata grande de té verde Arizona con miel y ginseng. Bien fría.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/057-arizona-green-tea-con-miel-680ml.jpg"
    ]
  },
  {
    "id": 58,
    "nombre": "Arizona Sandia Mucho Mango 680ml",
    "precio": 25,
    "categoria": "Bebidas",
    "descripcion": "Lata de Arizona sabor Mucho Mango, refrescante para la tarde.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/058-arizona-sandia-mucho-mango-680ml.jpg"
    ]
  },
  {
    "id": 59,
    "nombre": "Boing de Guayaba 500ml",
    "precio": 18,
    "categoria": "Bebidas",
    "descripcion": "Jugo Boing en envase de vidrio frío, el favorito de la cafetería.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/059-boing-de-guayaba-500ml.jpg"
    ]
  },
  {
    "id": 60,
    "nombre": "Boing de Mango 500ml",
    "precio": 18,
    "categoria": "Bebidas",
    "descripcion": "Boing de pulpa de mango natural en vidrio, bien frío.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/060-boing-de-mango-500ml.jpg"
    ]
  },
  {
    "id": 61,
    "nombre": "Agua Ciel Purificada 1 Litro",
    "precio": 15,
    "categoria": "Bebidas",
    "descripcion": "Botella de 1 litro de agua Ciel purificada.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/061-agua-ciel-purificada-1-litro.jpg"
    ]
  },
  {
    "id": 62,
    "nombre": "Agua Bonafont Levité Fresa 1L",
    "precio": 20,
    "categoria": "Bebidas",
    "descripcion": "Agua infusionada con sabor ligero a fresa natural.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/062-agua-bonafont-levite-fresa-1l.jpg"
    ]
  },
  {
    "id": 63,
    "nombre": "Café Frío Americano con Hielo",
    "precio": 25,
    "categoria": "Bebidas",
    "descripcion": "Vaso de café frío recién preparado con grano de Chiapas.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/063-cafe-frio-americano-con-hielo.jpg"
    ]
  },
  {
    "id": 64,
    "nombre": "Iced Latte Vainilla 400ml",
    "precio": 35,
    "categoria": "Bebidas",
    "descripcion": "Café espresso con leche entera y jarabe de vainilla con hielo.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/064-iced-latte-vainilla-400ml.jpg"
    ]
  },
  {
    "id": 65,
    "nombre": "Jarritos Mandarina 600ml",
    "precio": 18,
    "categoria": "Bebidas",
    "descripcion": "Refresco mexicano tradicional sabor mandarina con gas bien helado.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/065-jarritos-mandarina-600ml.jpg"
    ]
  },
  {
    "id": 66,
    "nombre": "Sprite 600ml Lima-Limón",
    "precio": 22,
    "categoria": "Bebidas",
    "descripcion": "Refresco Sprite 600ml bien frío.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/066-sprite-600ml-lima-limon.jpg"
    ]
  },
  {
    "id": 67,
    "nombre": "Electrolit Coco 625ml",
    "precio": 32,
    "categoria": "Bebidas",
    "descripcion": "Suero oral rehidratante sabor coco, ideal para reponer energía.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/067-electrolit-coco-625ml.jpg"
    ]
  },
  {
    "id": 68,
    "nombre": "Jugo del Valle Manzana 413ml",
    "precio": 19,
    "categoria": "Bebidas",
    "descripcion": "Néctar clarificado de manzana Del Valle en botella Pet.",
    "vendedorId": "u3",
    "vendido": true,
    "imagenes": [
      "/images/productos/068-jugo-del-valle-manzana-413ml.jpg"
    ]
  },
  {
    "id": 69,
    "nombre": "Mazapán De la Rosa Gigante 50g",
    "precio": 10,
    "categoria": "Dulces",
    "descripcion": "El auténtico mazapán de cacahuate que no se rompe si tienes suerte.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/069-mazapan-de-la-rosa-gigante-50g.jpg"
    ]
  },
  {
    "id": 70,
    "nombre": "Mazapán Cubierto de Chocolate",
    "precio": 14,
    "categoria": "Dulces",
    "descripcion": "Mazapán De la Rosa bañado en deliciosa cobertura de chocolate.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/070-mazapan-cubierto-de-chocolate.jpg"
    ]
  },
  {
    "id": 71,
    "nombre": "Pelón Pelo Rico 30g",
    "precio": 12,
    "categoria": "Dulces",
    "descripcion": "Caramelo suave sabor tamarindo para empujar.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/071-pelon-pelo-rico-30g.jpg"
    ]
  },
  {
    "id": 72,
    "nombre": "Paleta Payaso Ricolino 45g",
    "precio": 18,
    "categoria": "Dulces",
    "descripcion": "Bombón esponjoso cubierto con chocolate y gomitas de cara sonriente.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/072-paleta-payaso-ricolino-45g.jpg"
    ]
  },
  {
    "id": 73,
    "nombre": "Duvalín Avellana y Vainilla",
    "precio": 8,
    "categoria": "Dulces",
    "descripcion": "Untable cremoso bicromatico con cucharita plástica incluida.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/073-duvalin-avellana-y-vainilla.jpg"
    ]
  },
  {
    "id": 74,
    "nombre": "Pulparindo Clásico De la Rosa",
    "precio": 7,
    "categoria": "Dulces",
    "descripcion": "Barrita de pulpa de tamarindo natural salado y enchilado.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/074-pulparindo-clasico-de-la-rosa.jpg"
    ]
  },
  {
    "id": 75,
    "nombre": "Pulparindo Gigante Extra Picante",
    "precio": 12,
    "categoria": "Dulces",
    "descripcion": "Pulparindo tamaño doble con extra chile habanero.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/075-pulparindo-gigante-extra-picante.jpg"
    ]
  },
  {
    "id": 76,
    "nombre": "Kranky Ricolino 40g",
    "precio": 16,
    "categoria": "Dulces",
    "descripcion": "Hojuelas de maíz tostadas y crujientes cubiertas de chocolate.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/076-kranky-ricolino-40g.jpg"
    ]
  },
  {
    "id": 77,
    "nombre": "Bubu Lubu Ricolino 35g",
    "precio": 14,
    "categoria": "Dulces",
    "descripcion": "Malvavisco con jalea sabor fresa y cubierta de chocolate frío.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/077-bubu-lubu-ricolino-35g.jpg"
    ]
  },
  {
    "id": 78,
    "nombre": "Chocolate Carlos V 18g",
    "precio": 12,
    "categoria": "Dulces",
    "descripcion": "El rey de los chocolates con leche suizo-mexicano.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/078-chocolate-carlos-v-18g.jpg"
    ]
  },
  {
    "id": 79,
    "nombre": "Snickers Barra 52g",
    "precio": 22,
    "categoria": "Dulces",
    "descripcion": "Chocolate con relleno de caramelo, turrón y cacahuates tostados.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/079-snickers-barra-52g.jpg"
    ]
  },
  {
    "id": 80,
    "nombre": "Kinder Bueno 43g",
    "precio": 28,
    "categoria": "Dulces",
    "descripcion": "Dos barritas crujientes con barquillo relleno de crema de avellanas.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/080-kinder-bueno-43g.jpg"
    ]
  },
  {
    "id": 81,
    "nombre": "Lucas Muecas Chamoy",
    "precio": 15,
    "categoria": "Dulces",
    "descripcion": "Paleta sabor caramelo con chile en polvo en contenedor plástico.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/081-lucas-muecas-chamoy.jpg"
    ]
  },
  {
    "id": 82,
    "nombre": "Rockaleta Paleta de Caramelo",
    "precio": 10,
    "categoria": "Dulces",
    "descripcion": "Paleta con 4 capas de chiles de colores y centro de goma de mascar.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/082-rockaleta-paleta-de-caramelo.jpg"
    ]
  },
  {
    "id": 83,
    "nombre": "Tamborines Enchilados 50g",
    "precio": 14,
    "categoria": "Dulces",
    "descripcion": "Dulce suave de tamarindo con sal y chile en forma de tambor.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/083-tamborines-enchilados-50g.jpg"
    ]
  },
  {
    "id": 84,
    "nombre": "Ferrero Rocher paquete de 3",
    "precio": 35,
    "categoria": "Dulces",
    "descripcion": "Bombones finos de avellana entera tostada envueltos en dorada presentación.",
    "vendedorId": "u2",
    "vendido": true,
    "imagenes": [
      "/images/productos/084-ferrero-rocher-paquete-de-3.jpg"
    ]
  },
  {
    "id": 85,
    "nombre": "Rebanada de Pizza Pepperoni",
    "precio": 25,
    "categoria": "Comida",
    "descripcion": "Rebanada grande de Little Caesars calientita con extra queso y pepperoni.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/085-rebanada-de-pizza-pepperoni.jpg"
    ]
  },
  {
    "id": 86,
    "nombre": "Rebanada de Pizza Tres Quesos",
    "precio": 25,
    "categoria": "Comida",
    "descripcion": "Pizza con mozzarella, provolone y parmesano crujiente.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/086-rebanada-de-pizza-tres-quesos.jpg"
    ]
  },
  {
    "id": 87,
    "nombre": "Torta de Milanesa con Queso",
    "precio": 45,
    "categoria": "Comida",
    "descripcion": "Torta en telera con milanesa de pollo empanizada, frijoles, quesillo y aguacate.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/087-torta-de-milanesa-con-queso.jpg"
    ]
  },
  {
    "id": 88,
    "nombre": "Torta de Jamón y Queso Panela",
    "precio": 35,
    "categoria": "Comida",
    "descripcion": "Torta fresca con mayonesa, jitomate, lechuga y chiles en vinagre.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/088-torta-de-jamon-y-queso-panela.jpg"
    ]
  },
  {
    "id": 89,
    "nombre": "Burrito de Bistec con Queso",
    "precio": 40,
    "categoria": "Comida",
    "descripcion": "Burrito norteño en tortilla de harina grande con bistec asado y queso gouda.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/089-burrito-de-bistec-con-queso.jpg"
    ]
  },
  {
    "id": 90,
    "nombre": "Burrito de Chicharrón Prensado",
    "precio": 38,
    "categoria": "Comida",
    "descripcion": "Burrito relleno de chicharrón prensado guisado en salsa verde.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/090-burrito-de-chicharron-prensado.jpg"
    ]
  },
  {
    "id": 91,
    "nombre": "Sándwich Clásico de Pavo",
    "precio": 30,
    "categoria": "Comida",
    "descripcion": "Pan integral con pechuga de pavo, queso manchego, lechuga y aderezo especial.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/091-sandwich-clasico-de-pavo.jpg"
    ]
  },
  {
    "id": 92,
    "nombre": "Club Sándwich Triple con Papas",
    "precio": 55,
    "categoria": "Comida",
    "descripcion": "Tres pisos de sándwich con tocino, pollo, jamón, queso y papas fritas.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/092-club-sandwich-triple-con-papas.jpg"
    ]
  },
  {
    "id": 93,
    "nombre": "Orden de Molletes con Frijol y Queso",
    "precio": 35,
    "categoria": "Comida",
    "descripcion": "Dos mitades de bolillo con frijoles refritos, queso gratinado y pico de gallo.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/093-orden-de-molletes-con-frijol-y-queso.jpg"
    ]
  },
  {
    "id": 94,
    "nombre": "Hot Dog Especial con Tocino",
    "precio": 30,
    "categoria": "Comida",
    "descripcion": "Salchicha de pavo envuelta en tocino crujiente, jitomate, cebolla y aderezos.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/094-hot-dog-especial-con-tocino.jpg"
    ]
  },
  {
    "id": 95,
    "nombre": "Quesadilla Gigante en Harina con Bistec",
    "precio": 42,
    "categoria": "Comida",
    "descripcion": "Tortilla de harina de 30cm doblada a la mitad con queso Oaxaca y bistec.",
    "vendedorId": "u1",
    "vendido": false,
    "imagenes": [
      "/images/productos/095-quesadilla-gigante-en-harina-con-bistec.jpg"
    ]
  },
  {
    "id": 96,
    "nombre": "Orden de 3 Tacos al Pastor",
    "precio": 45,
    "categoria": "Comida",
    "descripcion": "Tres tacos de carne al pastor con piña, cilantro, cebolla y salsa taquera.",
    "vendedorId": "u2",
    "vendido": false,
    "imagenes": [
      "/images/productos/096-orden-de-3-tacos-al-pastor.jpg"
    ]
  },
  {
    "id": 97,
    "nombre": "Sushi Roll California (8 piezas)",
    "precio": 60,
    "categoria": "Comida",
    "descripcion": "Rollo empanizado de surimi, queso crema y aguacate con salsa chipotle y soya.",
    "vendedorId": "u3",
    "vendido": false,
    "imagenes": [
      "/images/productos/097-sushi-roll-california-8-piezas.jpg"
    ]
  },
  {
    "id": 98,
    "nombre": "Hamburguesa con Queso y Tocino",
    "precio": 50,
    "categoria": "Comida",
    "descripcion": "Carne 100% res asada, queso americano, tocino crujiente, lechuga y tomate.",
    "vendedorId": "u4",
    "vendido": false,
    "imagenes": [
      "/images/productos/098-hamburguesa-con-queso-y-tocino.jpg"
    ]
  },
  {
    "id": 99,
    "nombre": "Ensalada César con Pollo Asado",
    "precio": 48,
    "categoria": "Comida",
    "descripcion": "Lechuga orejona fresca, pechuga de pollo a la plancha, crutones y aderezo césar.",
    "vendedorId": "u5",
    "vendido": false,
    "imagenes": [
      "/images/productos/099-ensalada-cesar-con-pollo-asado.jpg"
    ]
  },
  {
    "id": 100,
    "nombre": "Sincronizada con Jamón y Doble Queso",
    "precio": 28,
    "categoria": "Comida",
    "descripcion": "Dos tortillas de harina con jamón de pavo y abundante queso fundido.",
    "vendedorId": "u1",
    "vendido": true,
    "imagenes": [
      "/images/productos/100-sincronizada-con-jamon-y-doble-queso.jpg"
    ]
  }
];

export const FAVORITOS_INICIALES: number[] = [1, 3, 5, 18, 35, 52, 69, 85];

export function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function imagenProducto(p: Producto): string {
  return p.imagenes[0] ?? ICONO_CATEGORIA[p.categoria];
}

export function enlaceWhatsApp(telefono: string, mensaje: string): string {
  const numero = telefono.replace(/\D/g, '');
  return `https://wa.me/52${numero}?text=${encodeURIComponent(mensaje)}`;
}
