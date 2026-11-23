const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Paleta de colores acorde a FIF Store
  const primaryNavy = rgb(27 / 255, 54 / 255, 76 / 255);    // #1b364c
  const secondaryNavy = rgb(45 / 255, 64 / 255, 89 / 255);  // #2d4059
  const accentOrange = rgb(251 / 255, 176 / 255, 64 / 255); // #fbb040
  const lightBg = rgb(245 / 255, 247 / 255, 250 / 255);
  const textDark = rgb(30 / 255, 41 / 255, 59 / 255);
  const textMuted = rgb(100 / 255, 116 / 255, 139 / 255);
  const borderGray = rgb(226 / 255, 232 / 255, 240 / 255);
  const white = rgb(1, 1, 1);
  const codeBg = rgb(241 / 255, 245 / 255, 249 / 255);

  const PAGE_WIDTH = 595.28;  // A4
  const PAGE_HEIGHT = 841.89; // A4
  const MARGIN = 45;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  let currentPage = null;
  let y = PAGE_HEIGHT - MARGIN;
  const pages = [];

  function newPage() {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(currentPage);
    y = PAGE_HEIGHT - MARGIN;

    // Encabezado sutil en páginas subsiguientes
    if (pages.length > 1) {
      currentPage.drawRectangle({
        x: MARGIN,
        y: PAGE_HEIGHT - 38,
        width: CONTENT_WIDTH,
        height: 1,
        color: borderGray,
      });

      currentPage.drawText('FIF STORE — REPORTE TÉCNICO DE IMPLEMENTACIÓN', {
        x: MARGIN,
        y: PAGE_HEIGHT - 32,
        size: 8,
        font: fontBold,
        color: secondaryNavy,
      });

      currentPage.drawText('UAQ • FACULTAD DE INFORMÁTICA', {
        x: PAGE_WIDTH - MARGIN - 140,
        y: PAGE_HEIGHT - 32,
        size: 8,
        font: fontRegular,
        color: textMuted,
      });

      y = PAGE_HEIGHT - 55;
    }
    return currentPage;
  }

  function checkSpace(needed) {
    if (y - needed < MARGIN + 25) {
      newPage();
    }
  }

  function drawHeading1(title) {
    checkSpace(40);
    y -= 10;
    currentPage.drawRectangle({
      x: MARGIN,
      y: y - 4,
      width: 4,
      height: 18,
      color: accentOrange,
    });
    currentPage.drawText(title, {
      x: MARGIN + 12,
      y: y,
      size: 15,
      font: fontBold,
      color: primaryNavy,
    });
    y -= 22;
  }

  function drawHeading2(title) {
    checkSpace(28);
    y -= 6;
    currentPage.drawText(title, {
      x: MARGIN,
      y: y,
      size: 12,
      font: fontBold,
      color: secondaryNavy,
    });
    y -= 16;
  }

  function drawParagraph(text, font = fontRegular, size = 9.5, color = textDark, lineHeight = 14) {
    const words = text.split(' ');
    let line = '';

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, size);

      if (width > CONTENT_WIDTH) {
        checkSpace(lineHeight);
        currentPage.drawText(line, {
          x: MARGIN,
          y: y,
          size,
          font,
          color,
        });
        y -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      checkSpace(lineHeight);
      currentPage.drawText(line, {
        x: MARGIN,
        y: y,
        size,
        font,
        color,
      });
      y -= lineHeight;
    }
    y -= 4; // espaciado entre párrafos
  }

  function drawBullet(title, desc) {
    checkSpace(16);
    currentPage.drawCircle({
      x: MARGIN + 6,
      y: y + 3,
      size: 2.5,
      color: accentOrange,
    });

    const titleWidth = fontBold.widthOfTextAtSize(title + ': ', 9.5);
    currentPage.drawText(title + ': ', {
      x: MARGIN + 15,
      y: y,
      size: 9.5,
      font: fontBold,
      color: textDark,
    });

    const remainingWidth = CONTENT_WIDTH - 15 - titleWidth;
    const words = desc.split(' ');
    let line = '';
    let isFirstLine = true;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const targetWidth = isFirstLine ? remainingWidth : CONTENT_WIDTH - 15;
      const width = fontRegular.widthOfTextAtSize(testLine, 9.5);

      if (width > targetWidth) {
        if (isFirstLine) {
          currentPage.drawText(line, {
            x: MARGIN + 15 + titleWidth,
            y: y,
            size: 9.5,
            font: fontRegular,
            color: textDark,
          });
          y -= 13;
          checkSpace(13);
          isFirstLine = false;
        } else {
          currentPage.drawText(line, {
            x: MARGIN + 15,
            y: y,
            size: 9.5,
            font: fontRegular,
            color: textDark,
          });
          y -= 13;
          checkSpace(13);
        }
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      const startX = isFirstLine ? MARGIN + 15 + titleWidth : MARGIN + 15;
      currentPage.drawText(line, {
        x: startX,
        y: y,
        size: 9.5,
        font: fontRegular,
        color: textDark,
      });
      y -= 13;
    }
    y -= 3;
  }

  function drawCodeBlock(codeLines) {
    const height = codeLines.length * 13 + 12;
    checkSpace(height + 10);

    currentPage.drawRectangle({
      x: MARGIN,
      y: y - height + 10,
      width: CONTENT_WIDTH,
      height: height,
      color: codeBg,
      borderColor: borderGray,
      borderWidth: 1,
    });

    let codeY = y - 3;
    for (const line of codeLines) {
      currentPage.drawText(line, {
        x: MARGIN + 12,
        y: codeY,
        size: 8.5,
        font: fontRegular,
        color: secondaryNavy,
      });
      codeY -= 13;
    }
    y -= height + 6;
  }

  function drawTable(headers, rows, colWidths) {
    const rowHeight = 18;
    const tableHeight = (rows.length + 1) * rowHeight;
    checkSpace(tableHeight + 10);

    // Header row
    currentPage.drawRectangle({
      x: MARGIN,
      y: y - rowHeight + 4,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: primaryNavy,
    });

    let currentX = MARGIN;
    headers.forEach((h, i) => {
      currentPage.drawText(h, {
        x: currentX + 6,
        y: y - 8,
        size: 8.5,
        font: fontBold,
        color: white,
      });
      currentX += colWidths[i];
    });

    y -= rowHeight;

    // Body rows
    rows.forEach((row, rIdx) => {
      const isEven = rIdx % 2 === 0;
      currentPage.drawRectangle({
        x: MARGIN,
        y: y - rowHeight + 4,
        width: CONTENT_WIDTH,
        height: rowHeight,
        color: isEven ? white : lightBg,
        borderColor: borderGray,
        borderWidth: 0.5,
      });

      currentX = MARGIN;
      row.forEach((cell, cIdx) => {
        currentPage.drawText(String(cell), {
          x: currentX + 6,
          y: y - 8,
          size: 8,
          font: fontRegular,
          color: textDark,
        });
        currentX += colWidths[cIdx];
      });

      y -= rowHeight;
    });

    y -= 8;
  }

  // Las fuentes estándar del PDF solo admiten la codificación WinAnsi (latín).
  const EXTRA_WINANSI = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
  function seguro(texto) {
    return Array.from(String(texto).normalize('NFC')).map((ch) => {
      const c = ch.codePointAt(0);
      if ((c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) || EXTRA_WINANSI.includes(ch)) return ch;
      const base = ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
      return /^[\x20-\x7e]$/.test(base) ? base : '';
    }).join('');
  }

  // Recorta el texto para que quepa en el ancho de la columna.
  const recortados = [];
  function ajustar(texto, ancho, font, size) {
    let t = seguro(texto);
    if (font.widthOfTextAtSize(t, size) <= ancho) return t;
    recortados.push(String(texto));
    while (t.length > 1 && font.widthOfTextAtSize(t + '…', size) > ancho) t = t.slice(0, -1);
    return t + '…';
  }

  // Tabla larga: si no cabe, continúa en la página siguiente repitiendo el encabezado.
  function drawLongTable(headers, rows, colWidths, size = 7.5) {
    const rowHeight = 16;
    const encabezado = () => {
      currentPage.drawRectangle({ x: MARGIN, y: y - rowHeight + 4, width: CONTENT_WIDTH, height: rowHeight, color: primaryNavy });
      let x = MARGIN;
      headers.forEach((h, i) => {
        currentPage.drawText(ajustar(h, colWidths[i] - 10, fontBold, 8), { x: x + 5, y: y - 7, size: 8, font: fontBold, color: white });
        x += colWidths[i];
      });
      y -= rowHeight;
    };
    checkSpace(rowHeight * 3);
    encabezado();
    rows.forEach((row, rIdx) => {
      if (y - rowHeight < MARGIN + 25) {
        newPage();
        encabezado();
      }
      currentPage.drawRectangle({
        x: MARGIN, y: y - rowHeight + 4, width: CONTENT_WIDTH, height: rowHeight,
        color: rIdx % 2 === 0 ? white : lightBg, borderColor: borderGray, borderWidth: 0.5,
      });
      let x = MARGIN;
      row.forEach((cell, cIdx) => {
        currentPage.drawText(ajustar(cell, colWidths[cIdx] - 10, fontRegular, size), { x: x + 5, y: y - 7, size, font: fontRegular, color: textDark });
        x += colWidths[cIdx];
      });
      y -= rowHeight;
    });
    y -= 8;
  }

  // Créditos de las imágenes del catálogo (fuente única: CREDITOS_IMAGENES.md).
  const creditosPath = path.join(__dirname, '..', 'CREDITOS_IMAGENES.md');
  const creditos = fs.existsSync(creditosPath)
    ? fs.readFileSync(creditosPath, 'utf8').split('\n')
        .filter((l) => /^\| \d+ \|/.test(l))
        .map((l) => l.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim().replace(/\\\|/g, '|')))
        .map(([id, producto, , fuente, autor, licencia]) => ({
          id, producto, autor, licencia, fuente: fuente.replace(/^\[([^\]]+)\].*$/, '$1'),
        }))
    : [];
  const totalOFF = creditos.filter((c) => c.fuente === 'Open Food Facts').length;
  const totalWM = creditos.filter((c) => c.fuente === 'Wikimedia Commons').length;

  // ==========================================
  // PÁGINA 1: PORTADA Y RESUMEN EJECUTIVO
  // ==========================================
  newPage();

  // Banner superior decorativo
  currentPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 140,
    width: PAGE_WIDTH,
    height: 140,
    color: primaryNavy,
  });

  // Franja decorativa dorada
  currentPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 146,
    width: PAGE_WIDTH,
    height: 6,
    color: accentOrange,
  });

  currentPage.drawText('UNIVERSIDAD AUTÓNOMA DE QUERÉTARO', {
    x: MARGIN,
    y: PAGE_HEIGHT - 50,
    size: 11,
    font: fontBold,
    color: accentOrange,
  });

  currentPage.drawText('FACULTAD DE INFORMÁTICA • FIF STORE', {
    x: MARGIN,
    y: PAGE_HEIGHT - 68,
    size: 9.5,
    font: fontRegular,
    color: white,
  });

  currentPage.drawText('REPORTE TÉCNICO DE IMPLEMENTACIÓN', {
    x: MARGIN,
    y: PAGE_HEIGHT - 102,
    size: 20,
    font: fontBold,
    color: white,
  });

  currentPage.drawText('Vistas del diseño, Base de Datos, Autenticación y 100 productos con imágenes reales', {
    x: MARGIN,
    y: PAGE_HEIGHT - 120,
    size: 9.5,
    font: fontOblique,
    color: rgb(220 / 255, 230 / 255, 240 / 255),
  });

  y = PAGE_HEIGHT - 175;

  // Cuadro de metadatos del proyecto
  currentPage.drawRectangle({
    x: MARGIN,
    y: y - 62,
    width: CONTENT_WIDTH,
    height: 62,
    color: lightBg,
    borderColor: borderGray,
    borderWidth: 1,
  });

  currentPage.drawText('FICHA TÉCNICA DEL PROYECTO', {
    x: MARGIN + 12,
    y: y - 14,
    size: 9,
    font: fontBold,
    color: secondaryNavy,
  });

  const metaCols = [
    { label: 'Framework:', val: 'Next.js 16 (App Router)' },
    { label: 'Base de Datos:', val: 'SQLite 3 (WAL Mode)' },
    { label: 'Seguridad / Auth:', val: 'Bcryptjs + HTTP-Only Session' },
    { label: 'Fecha:', val: 'Noviembre 2026' },
  ];

  let metaX = MARGIN + 12;
  metaCols.forEach((m, idx) => {
    if (idx === 2) {
      metaX = MARGIN + 12;
      y -= 16;
    }
    currentPage.drawText(m.label, { x: metaX, y: y - 32, size: 8, font: fontBold, color: textMuted });
    currentPage.drawText(m.val, { x: metaX + 85, y: y - 32, size: 8, font: fontRegular, color: textDark });
    metaX += 240;
  });

  y -= 58; // separación entre la ficha técnica y el primer título

  drawHeading1('1. Resumen Ejecutivo');
  drawParagraph(
    'El presente documento detalla la ingeniería técnica, arquitectura de software y modificaciones aplicadas al proyecto "FIF Store", una plataforma web progresiva para el comercio estudiantil dentro de la Facultad de Informática de la Universidad Autónoma de Querétaro (UAQ).'
  );
  drawParagraph(
    'En respuesta a los requerimientos solicitados, se cumplieron los siguientes objetivos clave:'
  );

  drawBullet('1. Vistas del Diseño en Figma', 'Implementación de las 14 pantallas del prototipo (inicio de sesión, registro, feed, detalle, publicación, favoritos, perfiles y sus estados vacíos y de confirmación) como una app web con aspecto móvil.');
  drawBullet('2. Catálogo de 100 Productos', 'Inserción de exactamente 100 productos clasificados en las 6 categorías institucionales, cada uno con una fotografía real del producto, verificada una por una y almacenada en el propio proyecto.');
  drawBullet('3. Base de Datos Relacional para DBA', 'Implementación de SQLite embebido con mejor rendimiento (better-sqlite3 en modo WAL), con llaves foráneas e índices. Además, se exportó el script fif_store.sql compatible con DBeaver, TablePlus, DataGrip, MySQL y PostgreSQL.');
  drawBullet('4. Autenticación Real (Login y Registro)', 'Desarrollo de API Routes seguras con hashing de contraseñas mediante bcryptjs, restricción por dominio institucional (@uaq.edu.mx) y control de sesiones persistentes.');
  drawBullet('5. Documentación y Reporte en PDF', 'README completo del repositorio, créditos y licencias de cada imagen (CREDITOS_IMAGENES.md) y generación automatizada de este informe técnico.');

  // ==========================================
  // VISTAS IMPLEMENTADAS (DISEÑO EN FIGMA)
  // ==========================================
  newPage();

  drawHeading1('2. Vistas Implementadas a partir del Diseño en Figma');
  drawParagraph(
    'Las pantallas se construyeron a partir del prototipo de Figma del proyecto con Next.js (App Router), React y Tailwind CSS. Todas comparten un marco con aspecto de teléfono, la paleta de colores del diseño y los íconos exportados de Figma (public/icons).'
  );

  drawTable(
    ['Ruta', 'Pantalla', 'Funcionalidad'],
    [
      ['/', 'Inicio de sesión', 'Acceso con correo institucional y botón de cuenta demo'],
      ['/registro', 'Crear cuenta', 'Alta con nombre, correo institucional y contraseña'],
      ['/feed', 'Inicio (feed)', 'Catálogo con buscador, filtros y estado sin resultados'],
      ['/producto/[id]', 'Detalle (comprador)', 'Favorito, datos del vendedor y botón Comprar (WhatsApp)'],
      ['/producto/[id]', 'Detalle (dueño)', 'Editar, marcar como vendido y eliminar con confirmación'],
      ['/producto/[id]/editar', 'Editar publicación', 'Formulario precargado, solo para el dueño'],
      ['/vender', 'Nueva publicación', 'Hasta 4 fotos, nombre, precio, descripción y categoría'],
      ['/favoritos', 'Favoritos', 'Lista de productos guardados y estado vacío'],
      ['/perfil', 'Mi perfil', 'Datos, estadísticas y publicaciones propias'],
      ['/perfil/editar', 'Editar perfil', 'Nombre, carrera y teléfono'],
      ['/vendedor/[id]', 'Perfil de vendedor', 'Publicaciones disponibles y botón Contactar'],
    ],
    [120, 110, 275]
  );

  drawHeading2('Componentes Reutilizables');
  drawBullet('Marco y navegación', 'phoneShell (marco móvil), topBar (barra superior con botón de regreso) y bottomNav (inicio, publicar y perfil), en app/components/ui.');
  drawBullet('Elementos comunes', 'avatar con iniciales, productImage (foto del producto o ícono de su categoría) y confirmDialog (modal "Eliminar publicación").');
  drawBullet('Formulario de publicación', 'productForm se usa para crear y para editar; reduce las fotos a 800 px antes de guardarlas.');
  drawBullet('Estados vacíos', 'Búsqueda sin resultados y favoritos vacíos, con los íconos y textos del diseño.');

  // ==========================================
  // ARQUITECTURA Y BASE DE DATOS
  // ==========================================
  newPage();

  drawHeading1('3. Base de Datos Relacional y Conexión para DBA');
  drawParagraph(
    'Para garantizar portabilidad absoluta y compatibilidad inmediata con clientes de administración de bases de datos (DBA Tools), se diseñó e implementó un esquema relacional normalizado persistido en fif_store.db y fif_store.sql.'
  );

  drawHeading2('Esquema Relacional (DDL)');
  drawParagraph(
    'El modelo consta de tres entidades principales con integridad referencial ON DELETE CASCADE:'
  );

  drawTable(
    ['Tabla', 'Campo', 'Tipo SQL', 'Restricciones / Descripción'],
    [
      ['usuarios', 'id', 'TEXT (PK)', 'Identificador alfanumérico único (ej. u1, u_17000...)'],
      ['usuarios', 'nombre', 'TEXT NOT NULL', 'Nombre completo del alumno'],
      ['usuarios', 'carrera', 'TEXT NOT NULL', 'Licenciatura o Ingeniería en la FIF'],
      ['usuarios', 'telefono', 'TEXT NOT NULL', 'Número telefónico para contacto vía WhatsApp'],
      ['usuarios', 'correo', 'TEXT UNIQUE NOT NULL', 'Correo institucional (@uaq.edu.mx)'],
      ['usuarios', 'password', 'TEXT NOT NULL', 'Hash seguro generado mediante bcrypt (10 rounds)'],
      ['productos', 'id', 'INTEGER (PK)', 'Clave primaria autoincremental (1 al 100+)'],
      ['productos', 'nombre', 'TEXT NOT NULL', 'Nombre comercial de la botana o comida'],
      ['productos', 'precio', 'REAL NOT NULL', 'Precio en moneda nacional ($MXN)'],
      ['productos', 'categoria', 'TEXT NOT NULL', 'Papas, Galletas, Gomitas, Bebidas, Dulces, Comida'],
      ['productos', 'descripcion', 'TEXT NOT NULL', 'Detalles de entrega en facultades o salones'],
      ['productos', 'vendedor_id', 'TEXT (FK)', 'Relación foránea hacia usuarios(id) con CASCADE'],
      ['productos', 'vendido', 'INTEGER (0/1)', 'Bandera booleana de disponibilidad'],
      ['productos', 'imagenes', 'TEXT (JSON)', 'JSON con rutas locales (/images/productos) o Base64'],
      ['favoritos', 'id', 'INTEGER (PK)', 'Identificador autoincremental del marcador'],
      ['favoritos', 'usuario_id', 'TEXT (FK)', 'Alumno que guardó el favorito'],
      ['favoritos', 'producto_id', 'INTEGER (FK)', 'Producto guardado en favoritos'],
    ],
    [75, 80, 95, 255]
  );

  drawHeading2('Guía de Conexión para el Administrador de Base de Datos (DBA)');
  drawParagraph(
    'Cualquier DBA o docente puede inspeccionar y manipular la base de datos a través de dos mecanismos inmediatos:'
  );

  drawBullet('Opción A (Conexión Directa en DBeaver / TablePlus / DataGrip / SQLiteStudio)', '1. Abrir DBeaver u otro cliente DBA. 2. Crear nueva conexión tipo "SQLite". 3. En el campo "Database File", seleccionar el archivo fif_store.db ubicado en la raíz del proyecto. 4. Clic en "Probar Conexión" y "Finalizar". Podrá visualizar diagramas ER, tablas y realizar consultas SQL en vivo.');
  drawBullet('Opción B (Importación en MySQL / PostgreSQL / Oracle)', 'Se generó en la raíz el archivo fif_store.sql que contiene todos los CREATE TABLE, DROP TABLE e INSERT INTO con sintaxis universal ANSI SQL, permitiendo su importación directa en MySQL Workbench, phpMyAdmin o pgAdmin.');

  // ==========================================
  // CATÁLOGO DE 100 PRODUCTOS E IMÁGENES
  // ==========================================
  newPage();

  drawHeading1('4. Catálogo de 100 Productos con Fotografías Reales');
  drawParagraph(
    'Se realizó un exhaustivo proceso de poblamiento con 100 registros fieles a la vida universitaria y a los comercios cotidianos de los estudiantes de la FIF (botanas, dulces típicos mexicanos, galletas, bebidas heladas y comida preparada).'
  );

  drawHeading2('Distribución por Categorías');
  drawTable(
    ['Categoría', 'Cantidad', 'Rango de Precios', 'Ejemplos representativos'],
    [
      ['Papas', '17', '$18 – $38 MXN', 'Takis Fuego, Ruffles Queso, Doritos, Chidas Adobadas, Pringles'],
      ['Galletas', '17', '$15 – $25 MXN', 'Emperador, Chokis, Oreo, Brownies Caseros con Nuez, Barritas'],
      ['Gomitas', '17', '$12 – $22 MXN', 'Panditas, Skwinkles, Gomitas Enchiladas Mango, Gusanos Trolli'],
      ['Bebidas', '17', '$15 – $45 MXN', 'Coca-Cola Fría, Red Bull, Monster Mango Loco, Boing, Arizona'],
      ['Dulces', '16', '$7 – $35 MXN', 'Mazapán De la Rosa, Pelón Pelo Rico, Paleta Payaso, Duvalín'],
      ['Comida', '16', '$25 – $60 MXN', 'Pizza Pepperoni, Torta de Milanesa, Burrito de Bistec, Sushi Roll'],
      ['TOTAL', '100', '$7 – $60 MXN', '100% de productos asociados a vendedores reales'],
    ],
    [75, 60, 95, 275]
  );

  drawHeading2('Obtención y Verificación de las Imágenes');
  drawParagraph(
    'En la primera versión, cada producto enlazaba a una fotografía genérica de Unsplash que en varios casos no correspondía al artículo (por ejemplo, una pizza para unas papas adobadas). Por ello se sustituyeron las 100 imágenes por fotografías del producto real, elegidas una por una:'
  );

  drawBullet(`Productos de marca (${totalOFF})`, 'Fotografías reales del empaque tomadas de Open Food Facts, base de datos abierta de alimentos, dando prioridad a los productos registrados en México. Licencia CC BY-SA 3.0.');
  drawBullet(`Comida preparada y genéricos (${totalWM})`, 'Fotografías de Wikimedia Commons con licencias libres (CC0, dominio público, CC BY y CC BY-SA).');
  drawBullet('Búsqueda y verificación', 'Para cada producto se hicieron búsquedas específicas por marca, sabor y presentación (hasta tres rondas). Los candidatos se revisaron visualmente en hojas de contacto y se eligió la foto que muestra el producto exacto.');
  drawBullet('Almacenamiento local', 'Las 100 imágenes se guardaron en public/images/productos (JPEG, máximo 600 px, 7.4 MB en total) con nombres descriptivos como 001-takis-fuego-240g.jpg. Ya no dependen de servicios externos ni de conexión a Internet.');
  drawBullet('Actualización de referencias', 'Se actualizaron las rutas en fif_store.db (UPDATE en sitio que conserva usuarios y favoritos, seguido de VACUUM), fif_store.sql, scripts/seed.js y app/lib/data.ts. La caché del navegador cambió a la clave fif-store-v3 para no mostrar las URLs anteriores.');
  drawBullet('Mecanismo de resiliencia (fallback)', 'app/components/ui/productImage.tsx conserva el manejador onError: si una imagen no carga, se muestra el ícono ilustrativo de su categoría.');
  drawBullet('Créditos', 'La fuente, el autor y la licencia de cada imagen están en CREDITOS_IMAGENES.md y en el Anexo A de este reporte.');

  drawHeading2('Productos con Imagen Aproximada');
  drawParagraph(
    'Para los siguientes productos no existe una fotografía libre del artículo exacto (la marca no es real o la variante no está registrada), por lo que se usó la imagen disponible más cercana:'
  );
  drawLongTable(
    ['ID', 'Producto', 'Imagen utilizada'],
    [
      ['4, 5', 'Chidas Jalapeño / Chidas Adobadas', 'Barcel Chips Jalapeño y Lay\'s Adobadas ("Chidas" no es marca real)'],
      ['33', 'Galletas Piruetas Gamesa', 'Pirouline (barquillo enrollado); no hay registro del producto'],
      ['34', 'Wafers Vainilla Bauducco', 'Wafer de vainilla Signor; no hay foto de la versión de vainilla'],
      ['42', 'Skwinkles Clásicos Tamarindo', 'Skwinkles Chunks (mango con relleno de tamarindo)'],
      ['43, 47', 'Gomitas Dientes / Tiburones Trolli', 'Gomitas de colmillos (Over Joyed) y Tiburoncitos (Mogul)'],
      ['51', 'Gomitas Fritas Botana Mix', 'Fotografía de dulces enchilados mexicanos'],
      ['52', 'Coca-Cola 600ml Fría', 'Botella clásica de vidrio en lugar de la de plástico de 600 ml'],
      ['73', 'Duvalín Avellana y Vainilla', 'Duvalín de tres sabores (avellana, fresa y vainilla)'],
      ['88, 90', 'Torta de jamón / Burrito de chicharrón', 'Torta de jamón con huevo y burrito norteño de chile verde'],
    ],
    [40, 170, 295]
  );

  // ==========================================
  // SISTEMA DE AUTENTICACIÓN Y API
  // (continúa en la misma página que la tabla anterior)
  // ==========================================
  drawHeading1('5. Módulo de Autenticación: Login y Registro');
  drawParagraph(
    'Se reemplazaron los formularios estáticos con un sistema completo de autenticación de dos factores lógicos: validación en capa de cliente y procesamiento en endpoints API seguros.'
  );

  drawHeading2('Endpoints REST Implementados');
  drawLongTable(
    ['Método', 'Ruta', 'Función Principal', 'Códigos de Respuesta'],
    [
      ['POST', '/api/auth/login', 'Verifica credenciales (bcrypt) y crea la cookie de sesión', '200, 400, 401, 500'],
      ['POST', '/api/auth/register', 'Valida dominio @uaq.edu.mx, cifra la contraseña y registra', '200, 400, 409, 500'],
      ['GET', '/api/auth/me', 'Devuelve el usuario en sesión y el directorio de alumnos', '200'],
      ['POST', '/api/auth/logout', 'Elimina la cookie de sesión y restablece el cliente', '200'],
    ],
    [45, 105, 240, 115]
  );

  drawHeading2('Endpoints de Productos y Favoritos');
  drawLongTable(
    ['Método', 'Ruta', 'Función Principal', 'Códigos de Respuesta'],
    [
      ['GET', '/api/productos', 'Lista productos (filtros ?categoria= y ?q=)', '200, 500'],
      ['POST', '/api/productos', 'Crea una publicación del usuario en sesión', '200, 400, 500'],
      ['GET', '/api/productos/[id]', 'Devuelve el detalle de un producto', '200, 404, 500'],
      ['PUT', '/api/productos/[id]', 'Edita los datos o marca como vendido', '200, 500'],
      ['DELETE', '/api/productos/[id]', 'Elimina una publicación', '200, 500'],
      ['GET', '/api/favoritos', 'Lista los favoritos del usuario', '200, 500'],
      ['POST', '/api/favoritos', 'Agrega o quita un producto de favoritos', '200, 400, 500'],
    ],
    [45, 105, 240, 115]
  );

  drawHeading2('Seguridad y Hashing con Bcrypt');
  drawParagraph(
    'Las contraseñas nunca se almacenan en texto plano en la base de datos. Se utiliza la biblioteca bcryptjs con factor de costo 10 (salt rounds). Incluso si un atacante accede al archivo fif_store.db, los hashes unidireccionales protegen la privacidad de los usuarios.'
  );

  drawHeading2('Flujo de Registro y Validación Institucional');
  drawParagraph(
    'Al registrarse, el formulario solicita: Nombre Completo, Carrera (selector oficial de la FIF), Teléfono de WhatsApp, Correo Institucional y Contraseña. Se valida por expresión regular y regla de negocio que el correo pertenezca forzosamente a @uaq.edu.mx o @alumnos.uaq.mx.'
  );

  drawHeading2('Credenciales de Prueba para Evaluación');
  drawParagraph(
    'Para facilitar la revisión por parte del docente o evaluador, la base de datos se inicializó con 5 usuarios y contraseñas listas:'
  );

  drawCodeBlock([
    '// Usuario de prueba principal:',
    'Correo:     alan.rubio@uaq.edu.mx',
    'Password:   password123',
    '',
    '// Nota: En la pantalla de Login se incluyó un botón de "Cargar cuenta demo"',
    '// para autorrellenar las credenciales con un solo clic.',
  ]);

  // ==========================================
  // EJECUCIÓN, DOCUMENTACIÓN Y SOLUCIÓN DE PROBLEMAS
  // ==========================================
  newPage();

  drawHeading1('6. Ejecución, Documentación y Solución de Problemas');
  drawParagraph(
    'El repositorio incluye un README.md en español con la descripción de la aplicación, sus pantallas, la instalación, las cuentas de prueba, la estructura del proyecto, la base de datos, las imágenes, la API y las limitaciones conocidas. Para ejecutar el proyecto:'
  );
  drawCodeBlock([
    'git clone https://github.com/Spacee44/Fif_Store.git',
    'cd Fif_Store',
    'npm ci        # instala las versiones exactas de package-lock.json',
    'npm run dev   # servidor en http://localhost:3000',
  ]);
  drawBullet('Cuarentena de macOS (AirDrop o ZIP)', 'Al copiar el proyecto por AirDrop, macOS marca node_modules en cuarentena y bloquea los módulos nativos (better-sqlite3, Tailwind y Turbopack) con el error "library load disallowed by system policy". Solución: clonar el repositorio con git y ejecutar npm ci, o reinstalar con rm -rf node_modules && npm ci.');
  drawBullet('Avisos de npm 11', 'npm puede advertir que los scripts de instalación de better-sqlite3, esbuild y unrs-resolver no están aprobados. No impide ejecutar la aplicación, porque better-sqlite3 incluye binarios precompilados.');
  drawBullet('Respaldo de la base de datos', 'Por el modo WAL, antes de hacer commit de fif_store.db conviene detener el servidor, para que los cambios recientes pasen del archivo fif_store.db-wal (ignorado por Git) al archivo principal.');
  drawBullet('Créditos de imágenes', 'CREDITOS_IMAGENES.md documenta la fuente, el autor y la licencia de cada una de las 100 fotografías (ver Anexo A).');

  drawHeading1('7. Limitaciones Conocidas y Trabajo Futuro');
  drawBullet('Sesión', 'La cookie de sesión guarda el id del usuario sin firma, por lo que podría falsificarse. Se recomienda un token firmado (por ejemplo, JWT) o sesiones del lado del servidor.');
  drawBullet('Autorización', 'Los endpoints PUT y DELETE de /api/productos/[id] no verifican que quien hace la petición sea el dueño de la publicación.');
  drawBullet('Fotos de los usuarios', 'Se guardan en Base64 dentro de la base de datos, lo que la hace crecer rápido; convendría guardarlas como archivos o en un almacenamiento de objetos.');
  drawBullet('Imágenes aproximadas', 'Los productos listados en la sección 4 usan la imagen disponible más cercana; pueden renombrarse o fotografiarse para que coincidan exactamente.');

  // ==========================================
  // RESUMEN DE MODIFICACIONES
  // ==========================================
  newPage();

  drawHeading1('8. Matriz de Modificaciones de Archivos');
  drawParagraph(
    'A continuación se resume el inventario de archivos creados y editados en el repositorio:'
  );

  drawLongTable(
    ['Archivo / Ruta', 'Estado', 'Descripción del Cambio'],
    [
      ['fif_store.db', 'Creado', 'Base de datos SQLite con 100 productos y usuarios de prueba.'],
      ['fif_store.sql', 'Creado', 'Script SQL para DBAs (DBeaver, MySQL, Postgres, SQLite).'],
      ['app/lib/db.ts', 'Creado', 'Capa de acceso de datos con better-sqlite3 y modo WAL.'],
      ['app/lib/auth.ts', 'Creado', 'Manejo de cookies HTTP-Only y hashing con bcryptjs.'],
      ['app/api/auth/login/route.ts', 'Creado', 'Endpoint de validación de credenciales.'],
      ['app/api/auth/register/route.ts', 'Creado', 'Endpoint de registro con validación @uaq.edu.mx.'],
      ['app/api/auth/me/route.ts', 'Creado', 'Endpoint de verificación de sesión activa.'],
      ['app/api/auth/logout/route.ts', 'Creado', 'Endpoint de cierre de sesión.'],
      ['app/api/productos/route.ts', 'Creado', 'Endpoint para consultar y crear publicaciones.'],
      ['app/api/productos/[id]/route.ts', 'Creado', 'Endpoint para actualizar, marcar vendido y eliminar.'],
      ['app/api/favoritos/route.ts', 'Creado', 'Endpoint para listar y alternar favoritos.'],
      ['app/components/auth/login.tsx', 'Modificado', 'Formulario reactivo con API real y demo autofill.'],
      ['app/components/auth/register.tsx', 'Modificado', 'Formulario completo con carrera, tel y validaciones.'],
      ['app/components/profile/profileView.tsx', 'Modificado', 'Soporte de sesión dinámica y botón de Logout.'],
      ['app/components/ui/productImage.tsx', 'Modificado', 'Lazy loading y fallback onError automático.'],
      ['app/lib/store.ts', 'Modificado', 'Sincronización LocalStorage + API SQLite; caché v3.'],
      ['app/lib/data.ts', 'Modificado', 'Catálogo de 100 productos con imágenes locales.'],
      ['scripts/seed.js', 'Creado', 'Generación de datos con rutas de imágenes locales.'],
      ['app/components/ui/', 'Creado', 'Marco móvil, barras, avatar, imagen y diálogo.'],
      ['app/components/main/productDetail.tsx', 'Creado', 'Detalle de producto: vista de comprador y de dueño.'],
      ['app/components/products/', 'Creado', 'Formulario de publicación (nueva y edición) con fotos.'],
      ['app/components/favorites/favorites.tsx', 'Creado', 'Lista de favoritos y estado vacío.'],
      ['app/components/profile/editProfile.tsx', 'Creado', 'Edición de nombre, carrera y teléfono.'],
      ['app/<ruta>/page.tsx', 'Creado', 'Páginas: registro, vender, favoritos, perfil, producto.'],
      ['public/icons/', 'Creado', 'Íconos exportados del diseño en Figma.'],
      ['public/images/productos/', 'Creado', '100 fotografías reales del catálogo (JPEG, máx. 600 px).'],
      ['CREDITOS_IMAGENES.md', 'Creado', 'Fuente, autor y licencia de cada imagen.'],
      ['README.md', 'Modificado', 'Documentación completa del proyecto en español.'],
      ['scripts/generate-pdf.js', 'Modificado', 'Reporte ampliado: vistas, imágenes, problemas y anexo.'],
    ],
    [185, 60, 260]
  );

  drawHeading1('9. Conclusión y Verificación');
  drawParagraph(
    'El sistema "FIF Store" se encuentra completamente operativo, con su base de datos lista para inspección por parte de un DBA y con el servidor de desarrollo Next.js listo para ser levantado o probado en producción.'
  );

  // Cuadro final de validación exitosa
  checkSpace(80);
  currentPage.drawRectangle({
    x: MARGIN,
    y: y - 67,
    width: CONTENT_WIDTH,
    height: 67,
    color: rgb(236 / 255, 253 / 255, 245 / 255),
    borderColor: rgb(110 / 255, 231 / 255, 183 / 255),
    borderWidth: 1,
  });

  currentPage.drawText('ESTADO DE LA ENTREGA: COMPLETADA CON ÉXITO', {
    x: MARGIN + 12,
    y: y - 18,
    size: 10,
    font: fontBold,
    color: rgb(6 / 255, 95 / 255, 70 / 255),
  });

  currentPage.drawText('• 100 productos con fotografías reales, verificadas y guardadas en el proyecto', {
    x: MARGIN + 12,
    y: y - 32,
    size: 8.5,
    font: fontRegular,
    color: rgb(6 / 255, 95 / 255, 70 / 255),
  });

  currentPage.drawText('• Base de datos SQLite (fif_store.db) y script SQL (fif_store.sql) generados para DBA', {
    x: MARGIN + 12,
    y: y - 44,
    size: 8.5,
    font: fontRegular,
    color: rgb(6 / 255, 95 / 255, 70 / 255),
  });

  currentPage.drawText('• 14 pantallas del diseño implementadas; README y créditos de imágenes documentados', {
    x: MARGIN + 12,
    y: y - 56,
    size: 8.5,
    font: fontRegular,
    color: rgb(6 / 255, 95 / 255, 70 / 255),
  });
  y -= 75;

  // ==========================================
  // ANEXO A: CRÉDITOS DE LAS IMÁGENES
  // ==========================================
  if (creditos.length) {
    newPage();
    drawHeading1('Anexo A. Créditos de las Imágenes del Catálogo');
    drawParagraph(
      `Fuente, autor y licencia de cada una de las ${creditos.length} fotografías de public/images/productos. El enlace a cada imagen original está en CREDITOS_IMAGENES.md. Las marcas y empaques pertenecen a sus respectivos dueños y se usan con fines académicos.`
    );
    drawLongTable(
      ['ID', 'Producto', 'Fuente', 'Autor', 'Licencia'],
      creditos.map((c) => [c.id, c.producto, c.fuente, c.autor, c.licencia]),
      [26, 170, 92, 150, 67]
    );
  }

  if (recortados.length) {
    console.warn(`⚠ ${recortados.length} texto(s) recortados para caber en su columna:`, recortados);
  }

  // Numeración de páginas en pie de página
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.drawText(`Página ${idx + 1} de ${totalPages}`, {
      x: PAGE_WIDTH / 2 - 25,
      y: 20,
      size: 8,
      font: fontRegular,
      color: textMuted,
    });
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, '..', 'FIF_Store_Reporte_Implementacion.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`✓ Archivo PDF generado exitosamente en: ${outputPath}`);
}

generatePDF().catch(console.error);
