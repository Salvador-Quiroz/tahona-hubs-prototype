import type { Producto } from "./types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?q=82&w=2000&auto=format&fit=crop`;

export const productos: Producto[] = [
  {
    id: "prod-001",
    slug: "hogaza-masa-madre",
    nombre: "Hogaza de Masa Madre de la Casa",
    categoria: "Masa madre",
    descripcion_corta: "Corteza profunda, miga elástica y fermentación lenta.",
    descripcion_premium:
      "Harina de trigo, agua y sal en una fermentación paciente que deja una acidez amable. Una hogaza de mesa, tostada y memoria.",
    ingredientes: ["harina de trigo", "masa madre", "sal de mar"],
    precio_mxn: 145,
    tiempo_horneado_min: 44,
    calorias: 265,
    imagen_url: img("photo-1509440159596-0249088772ff"),
    disponibilidad: ["lunes", "miércoles", "viernes", "sábado"]
  },
  {
    id: "prod-002",
    slug: "baguette-tradicion",
    nombre: "Baguette Tradición",
    categoria: "Baguettes y rústicos",
    descripcion_corta: "Larga, crujiente y dorada para abrir aún tibia.",
    descripcion_premium:
      "Una pieza de corteza fina y greña marcada, horneada para llegar al casillero con el crujido intacto.",
    ingredientes: ["harina panadera", "levadura", "sal", "agua"],
    precio_mxn: 68,
    tiempo_horneado_min: 28,
    calorias: 230,
    imagen_url: img("photo-1549931319-a545dcf3bc73"),
    disponibilidad: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
  },
  {
    id: "prod-003",
    slug: "concha-vainilla-artesanal",
    nombre: "Concha de Vainilla Artesanal",
    categoria: "Dulce mexicano",
    descripcion_corta: "Mantequilla, vainilla y costra quebradiza de pan dulce.",
    descripcion_premium:
      "Suave al centro, aromática en la cubierta y hecha para comerse con café de olla antes de que avance la mañana.",
    ingredientes: ["harina", "huevo", "mantequilla", "vainilla", "azúcar"],
    precio_mxn: 42,
    tiempo_horneado_min: 22,
    calorias: 310,
    imagen_url: img("photo-1608198093002-ad4e005484ec"),
    disponibilidad: ["martes", "jueves", "sábado", "domingo"]
  },
  {
    id: "prod-004",
    slug: "croissant-mantequilla",
    nombre: "Croissant de Mantequilla",
    categoria: "Hojaldres",
    descripcion_corta: "Capas precisas, perfume lácteo y acabado ámbar.",
    descripcion_premium:
      "Laminado en frío, reposado con calma y horneado hasta que cada capa conserva aire, brillo y una mordida delicada.",
    ingredientes: ["harina", "mantequilla", "levadura", "leche", "sal"],
    precio_mxn: 58,
    tiempo_horneado_min: 24,
    calorias: 330,
    imagen_url: img("photo-1555507036-ab1f4038808a"),
    disponibilidad: ["lunes", "miércoles", "viernes", "domingo"]
  },
  {
    id: "prod-005",
    slug: "pan-de-muerto-nata",
    nombre: "Pan de Muerto con Nata",
    categoria: "Especiales",
    descripcion_corta: "Azahar, mantequilla y nata fresca de temporada.",
    descripcion_premium:
      "Una edición de temporada con masa aromática, azúcar fina y un centro de nata que recuerda la vitrina clásica de la ciudad.",
    ingredientes: ["harina", "azahar", "mantequilla", "huevo", "nata"],
    precio_mxn: 92,
    tiempo_horneado_min: 26,
    calorias: 390,
    imagen_url: img("photo-1605348107427-6a5cbd9c158e"),
    disponibilidad: ["viernes", "sábado", "domingo"]
  },
  {
    id: "prod-006",
    slug: "bolillo-clasico",
    nombre: "Bolillo Clásico",
    categoria: "Baguettes y rústicos",
    descripcion_corta: "El pan de diario: ligero, crujiente y honesto.",
    descripcion_premium:
      "Bolillo de costra clara y centro suave, listo para molletes, tortas o para acompañar una comida familiar.",
    ingredientes: ["harina", "levadura", "agua", "sal"],
    precio_mxn: 12,
    tiempo_horneado_min: 18,
    calorias: 150,
    imagen_url: img("photo-1568254183919-78a4f43a2877"),
    disponibilidad: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
  },
  {
    id: "prod-007",
    slug: "telera-suave",
    nombre: "Telera Suave",
    categoria: "Baguettes y rústicos",
    descripcion_corta: "Miga acolchonada, corte central y corteza tenue.",
    descripcion_premium:
      "La telera que sostiene una torta completa sin robar protagonismo: suave, aromática y recién salida del horno.",
    ingredientes: ["harina", "levadura", "manteca vegetal", "sal"],
    precio_mxn: 14,
    tiempo_horneado_min: 18,
    calorias: 170,
    imagen_url: img("photo-1598373182133-52452f7691ef"),
    disponibilidad: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
  },
  {
    id: "prod-008",
    slug: "ciabatta-aceite-oliva",
    nombre: "Ciabatta con Aceite de Oliva",
    categoria: "Masa madre",
    descripcion_corta: "Miga abierta, aroma a oliva y corteza ligera.",
    descripcion_premium:
      "Hidratación alta, reposo largo y aceite de oliva para una pieza rústica que funciona con quesos, jitomate y pan solo.",
    ingredientes: ["harina", "masa madre", "aceite de oliva", "sal"],
    precio_mxn: 74,
    tiempo_horneado_min: 31,
    calorias: 245,
    imagen_url: img("photo-1523294587484-bae6cc870010"),
    disponibilidad: ["martes", "jueves", "sábado"]
  },
  {
    id: "prod-009",
    slug: "focaccia-romero",
    nombre: "Focaccia de Romero y Sal",
    categoria: "Especiales",
    descripcion_corta: "Aceite de oliva, romero fresco y sal en escama.",
    descripcion_premium:
      "Una masa aireada y dorada con pequeñas albercas de aceite, pensada para compartir al centro de la mesa.",
    ingredientes: ["harina", "aceite de oliva", "romero", "sal de mar"],
    precio_mxn: 118,
    tiempo_horneado_min: 35,
    calorias: 285,
    imagen_url: img("photo-1600626333392-63e3f3c7f350"),
    disponibilidad: ["miércoles", "viernes", "sábado"]
  },
  {
    id: "prod-010",
    slug: "integral-semillas",
    nombre: "Integral con Semillas",
    categoria: "Masa madre",
    descripcion_corta: "Trigo integral, ajonjolí, linaza y pepita tostada.",
    descripcion_premium:
      "Una hogaza nutritiva de sabor profundo, con semillas tostadas que aportan textura y un final ligeramente dulce.",
    ingredientes: ["harina integral", "masa madre", "linaza", "ajonjolí", "pepita"],
    precio_mxn: 132,
    tiempo_horneado_min: 42,
    calorias: 255,
    imagen_url: img("photo-1586444248902-2f64eddc13df"),
    disponibilidad: ["lunes", "jueves", "sábado"]
  },
  {
    id: "prod-011",
    slug: "pan-de-chocolate",
    nombre: "Pan de Chocolate Oscuro",
    categoria: "Hojaldres",
    descripcion_corta: "Hojaldre laminado con chocolate semiamargo.",
    descripcion_premium:
      "Capas quebradizas envuelven barras de chocolate oscuro para un bocado intenso sin exceso de dulzor.",
    ingredientes: ["harina", "mantequilla", "chocolate 60%", "leche"],
    precio_mxn: 64,
    tiempo_horneado_min: 24,
    calorias: 360,
    imagen_url: img("photo-1519676867240-f03562e64548"),
    disponibilidad: ["martes", "jueves", "domingo"]
  },
  {
    id: "prod-012",
    slug: "danes-frutas",
    nombre: "Danés de Frutas de Temporada",
    categoria: "Hojaldres",
    descripcion_corta: "Crema pastelera y fruta fresca sobre masa laminada.",
    descripcion_premium:
      "Crujiente, crema sedosa y fruta de temporada en una pieza luminosa, hecha para el antojo de media tarde.",
    ingredientes: ["harina", "mantequilla", "crema pastelera", "fruta"],
    precio_mxn: 72,
    tiempo_horneado_min: 23,
    calorias: 340,
    imagen_url: img("photo-1517433670267-08bbd4be890f"),
    disponibilidad: ["viernes", "sábado", "domingo"]
  },
  {
    id: "prod-013",
    slug: "pretzel-sal-mar",
    nombre: "Pretzel con Sal de Mar",
    categoria: "Especiales",
    descripcion_corta: "Dorado intenso, miga densa y sal cristalina.",
    descripcion_premium:
      "Una pieza de inspiración europea adaptada a la vitrina mexicana: brillante, suave por dentro y perfecta con mostaza.",
    ingredientes: ["harina", "mantequilla", "malta", "sal de mar"],
    precio_mxn: 54,
    tiempo_horneado_min: 20,
    calorias: 290,
    imagen_url: img("photo-1558961363-fa8fdf82db35"),
    disponibilidad: ["miércoles", "sábado"]
  },
  {
    id: "prod-014",
    slug: "brioche-miel",
    nombre: "Brioche de Miel",
    categoria: "Dulce mexicano",
    descripcion_corta: "Miga dorada, mantequilla y miel de azahar.",
    descripcion_premium:
      "Un pan suave y elegante, enriquecido con huevo y mantequilla, barnizado con miel para un brillo discreto.",
    ingredientes: ["harina", "huevo", "mantequilla", "miel", "leche"],
    precio_mxn: 96,
    tiempo_horneado_min: 30,
    calorias: 375,
    imagen_url: img("photo-1550617931-e17a7b70dce2"),
    disponibilidad: ["jueves", "sábado", "domingo"]
  }
];
