export interface Question {
  id: string;
  type: "multiple-choice" | "arrange-word" | "translate" | "fill-gap";
  prompt: string;
  englishText: string;
  spanishText: string;
  options: string[];
  correctOptionIndex?: number;
  gapText?: string;
  correctGapWord?: string;
}

export interface Module {
  id: string;
  level: "basico" | "intermedio" | "avanzado";
  title: string;
  description: string;
  vocabulary: string[];
  phrases: { english: string; spanish: string }[];
  questions: Question[];
}

interface ThemeSpec {
  id: string;
  level: "basico" | "intermedio" | "avanzado";
  title: string;
  description: string;
  vocab: string[]; // 4 items (English)
  vocabTrans: string[]; // 4 items (Spanish, mapping to English)
  phraseEng: string; // 1 key english phrase
  phraseEsp: string; // 1 key spanish translation
  gapText: string; // e.g. "I want to ___ a table."
  gapWord: string; // "reserve"
  gapOptions: string[]; // ["reserve", "eat", "wash", "buy"]
}

const MASTER_SPECS: ThemeSpec[] = [
  // CATEGORIA 1: RESTAURANTES (10)
  {
    id: "m-rest-1",
    level: "basico",
    title: "Restaurante: Pedir una Hamburguesa",
    description: "Aprende cómo ordenar una rica hamburguesa con ingredientes básicos.",
    vocab: ["Burger", "Cheese", "Fries", "Order"],
    vocabTrans: ["Hamburguesa", "Queso", "Papas fritas", "Ordenar"],
    phraseEng: "I want a burger with cheese please",
    phraseEsp: "Quiero una hamburguesa con queso por favor",
    gapText: "I would like to ___ a burger.",
    gapWord: "order",
    gapOptions: ["order", "drink", "cook", "wash"]
  },
  {
    id: "m-rest-2",
    level: "basico",
    title: "Restaurante: Pedir la Cuenta",
    description: "Solicita la cuenta de forma clara al mesero al terminar de comer.",
    vocab: ["Bill", "Waiter", "Pay", "Table"],
    vocabTrans: ["Cuenta", "Mesero", "Pagar", "Mesa"],
    phraseEng: "Could you bring the bill please",
    phraseEsp: "¿Podría traer la cuenta por favor?",
    gapText: "Excuse me, I want to ___ the bill.",
    gapWord: "pay",
    gapOptions: ["pay", "eat", "bring", "listen"]
  },
  {
    id: "m-rest-3",
    level: "intermedio",
    title: "Restaurante: Postres y Café",
    description: "Práctica pidiendo postres y tipos de café al terminar tu comida.",
    vocab: ["Cake", "Coffee", "Sugar", "Dessert"],
    vocabTrans: ["Pastel", "Café", "Azúcar", "Postre"],
    phraseEng: "Would you like some chocolate cake with coffee",
    phraseEsp: "¿Le gustaría un poco de pastel de chocolate con café?",
    gapText: "I always put ___ in my coffee.",
    gapWord: "sugar",
    gapOptions: ["sugar", "salt", "water", "meat"]
  },
  {
    id: "m-rest-4",
    level: "intermedio",
    title: "Restaurante: Reclamar Plato Frío",
    description: "Usa frases profesionales para reportar que tu comida está fría.",
    vocab: ["Cold", "Warm", "Soup", "Change"],
    vocabTrans: ["Frío", "Caliente", "Sopa", "Cambiar"],
    phraseEng: "Excuse me this soup is very cold",
    phraseEsp: "Disculpe esta sopa está muy fría",
    gapText: "Can we ___ this cold soup?",
    gapWord: "change",
    gapOptions: ["change", "drink", "cook", "sell"]
  },
  {
    id: "m-rest-5",
    level: "avanzado",
    title: "Restaurante: Reservación Elegante",
    description: "Llama y reserva una mesa formal para una ocasión corporativa o familiar.",
    vocab: ["Reservation", "Table", "Evening", "Tonight"],
    vocabTrans: ["Reservación", "Mesa", "Tarde", "Esta noche"],
    phraseEng: "I made a reservation for tonight",
    phraseEsp: "Hice una reservación para esta noche",
    gapText: "I want to reserve a ___ for two people.",
    gapWord: "table",
    gapOptions: ["table", "food", "waiter", "glass"]
  },
  {
    id: "m-rest-6",
    level: "basico",
    title: "Restaurante: Bebidas con Hielo",
    description: "Pide bebidas refrescantes con o sin hielo según tu gusto.",
    vocab: ["Soda", "Water", "Ice", "Lemon"],
    vocabTrans: ["Refresco", "Agua", "Hielo", "Limón"],
    phraseEng: "An orange juice with extra ice please",
    phraseEsp: "Un jugo de naranja con hielo extra por favor",
    gapText: "Please bring me a glass of ___ water.",
    gapWord: "cold",
    gapOptions: ["cold", "hot", "dry", "sweet"]
  },
  {
    id: "m-rest-7",
    level: "basico",
    title: "Restaurante: El Menú Diario",
    description: "Pregunta al mesero por las recomendaciones y opciones del día.",
    vocab: ["Menu", "Today", "Special", "Select"],
    vocabTrans: ["Menú", "Hoy", "Especial", "Seleccionar"],
    phraseEng: "What is the special dish of today",
    phraseEsp: "¿Cuál es el platillo especial de hoy?",
    gapText: "Can I inspect the ___ of the restaurant?",
    gapWord: "menu",
    gapOptions: ["menu", "kitchen", "street", "car"]
  },
  {
    id: "m-rest-8",
    level: "intermedio",
    title: "Restaurante: Opciones Vegetarianas",
    description: "Aprende a pedir opciones sin carne ni productos de origen animal.",
    vocab: ["Vegetarian", "Salad", "Tomato", "Healthy"],
    vocabTrans: ["Vegetariano", "Ensalada", "Tomate", "Saludable"],
    phraseEng: "Do you serve vegetarian salads here",
    phraseEsp: "¿Sirven ensaladas vegetarianas aquí?",
    gapText: "Eating fresh salad is very ___.",
    gapWord: "healthy",
    gapOptions: ["healthy", "bad", "toxic", "expensive"]
  },
  {
    id: "m-rest-9",
    level: "basico",
    title: "Restaurante: Cubiertos Básicos",
    description: "Pide un tenedor o cuchara extra en caso de que se te caiga.",
    vocab: ["Fork", "Spoon", "Knife", "Plate"],
    vocabTrans: ["Tenedor", "Cuchara", "Cuchillo", "Plato"],
    phraseEng: "Can you bring me a clean fork",
    phraseEsp: "¿Me puedes traer un tenedor limpio?",
    gapText: "I cut my delicious steak with a ___.",
    gapWord: "knife",
    gapOptions: ["knife", "spoon", "sugar", "glass"]
  },
  {
    id: "m-rest-10",
    level: "intermedio",
    title: "Restaurante: Dejar Propina",
    description: "Agradece el excelente servicio dejando una propina generosa.",
    vocab: ["Tip", "Service", "Generous", "Excellent"],
    vocabTrans: ["Propina", "Servicio", "Generoso", "Excelente"],
    phraseEng: "This service was absolutely excellent",
    phraseEsp: "Este servicio fue absolutamente excelente",
    gapText: "We should leave a good ___ for the waiter.",
    gapWord: "tip",
    gapOptions: ["tip", "card", "bill", "menu"]
  },

  // CATEGORIA 2: SUPERMERCADO (10)
  {
    id: "m-super-1",
    level: "basico",
    title: "Supermercado: En el Supermercado",
    description: "Encuentra la entrada principal y ubica el pasillo de compras generales.",
    vocab: ["Supermarket", "Entrance", "Aisle", "Store"],
    vocabTrans: ["Supermercado", "Entrada", "Pasillo", "Tienda"],
    phraseEng: "Where is the entrance of the supermarket",
    phraseEsp: "¿Dónde está la entrada del supermercado?",
    gapText: "The fresh fruit is in the first ___.",
    gapWord: "aisle",
    gapOptions: ["aisle", "roof", "car", "ticket"]
  },
  {
    id: "m-super-2",
    level: "basico",
    title: "Supermercado: Comprar Leche y Huevos",
    description: "Ubica y solicita insumos diarios de primera necesidad.",
    vocab: ["Milk", "Eggs", "Fridge", "Butter"],
    vocabTrans: ["Leche", "Huevos", "Refrigerador", "Mantequilla"],
    phraseEng: "I want to buy organic milk and fresh eggs",
    phraseEsp: "Quiero comprar leche orgánica y huevos frescos",
    gapText: "Put the fresh milk in the ___.",
    gapWord: "fridge",
    gapOptions: ["fridge", "oven", "table", "chair"]
  },
  {
    id: "m-super-3",
    level: "basico",
    title: "Supermercado: Frutas Frescas",
    description: "Selecciona las manzanas y plátanos más frescos del estante.",
    vocab: ["Apples", "Bananas", "Fresh", "Price"],
    vocabTrans: ["Manzanas", "Plátanos", "Frescos", "Precio"],
    phraseEng: "These sweet apples are very fresh",
    phraseEsp: "Estas manzanas dulces están muy frescas",
    gapText: "What is the total ___ of these bananas?",
    gapWord: "price",
    gapOptions: ["price", "color", "name", "size"]
  },
  {
    id: "m-super-4",
    level: "intermedio",
    title: "Supermercado: Encontrar del Carrito",
    description: "Consigue un carrito de compras desbloqueándolo con una moneda.",
    vocab: ["Cart", "Coin", "Unlock", "Handle"],
    vocabTrans: ["Carrito", "Moneda", "Desbloquear", "Mango"],
    phraseEng: "You need a coin to unlock the shopping cart",
    phraseEsp: "Necesitas una moneda para desbloquear el carrito de compras",
    gapText: "Let us push this big shopping ___ together.",
    gapWord: "cart",
    gapOptions: ["cart", "bike", "plane", "shoe"]
  },
  {
    id: "m-super-5",
    level: "basico",
    title: "Supermercado: Pagar en Caja",
    description: "Saca tus artículos y prepárate para pagar con dinero en efectivo o tarjeta.",
    vocab: ["Cashier", "Pay", "Cash", "Receipt"],
    vocabTrans: ["Cajero", "Pagar", "Efectivo", "Recibo"],
    phraseEng: "I will pay with cash at the cashier",
    phraseEsp: "Pagaré con efectivo en la caja",
    gapText: "Keep the ___ in case of returned items.",
    gapWord: "receipt",
    gapOptions: ["receipt", "milk", "eggs", "bag"]
  },
  {
    id: "m-super-6",
    level: "intermedio",
    title: "Supermercado: Alimentos Congelados",
    description: "Encuentra la sección de congeladores para pizzas y helados.",
    vocab: ["Frozen", "Pizza", "Ice", "Section"],
    vocabTrans: ["Congelado", "Pizza", "Hielo", "Sección"],
    phraseEng: "Is the frozen pizza in this corridor",
    phraseEsp: "¿Está la pizza congelada en este pasillo?",
    gapText: "Keep the ice cream in the ___ department.",
    gapWord: "frozen",
    gapOptions: ["frozen", "hot", "dry", "sweet"]
  },
  {
    id: "m-super-7",
    level: "basico",
    title: "Supermercado: Pan recién Horneado",
    description: "Compra deliciosos panes y bollos rellenos recién salidos del horno.",
    vocab: ["Bakery", "Bread", "Fresh", "Warm"],
    vocabTrans: ["Panadería", "Pan", "Fresco", "Calentito"],
    phraseEng: "The bakery smells amazing and fresh",
    phraseEsp: "La panadería huele increíble y fresca",
    gapText: "I want a loaf of white ___.",
    gapWord: "bread",
    gapOptions: ["bread", "juice", "sugar", "salt"]
  },
  {
    id: "m-super-8",
    level: "basico",
    title: "Supermercado: Bolsa Ecológica",
    description: "Usa bolsas reutilizables para cuidar el planeta en cada compra.",
    vocab: ["Bag", "Green", "Reusable", "Planet"],
    vocabTrans: ["Bolsa", "Verde", "Reutilizable", "Planeta"],
    phraseEng: "Bring your reusable green bags please",
    phraseEsp: "Trae tus bolsas reutilizables verdes por favor",
    gapText: "Do you need a paper ___ for your food?",
    gapWord: "bag",
    gapOptions: ["bag", "car", "apple", "sugar"]
  },
  {
    id: "m-super-9",
    level: "intermedio",
    title: "Supermercado: Carnicería y Mariscos",
    description: "Aprende a pedir carne fresca, filetes o salmón en la sección especializada.",
    vocab: ["Butcher", "Meat", "Chicken", "Fish"],
    vocabTrans: ["Carnicero", "Carne", "Pollo", "Pescado"],
    phraseEng: "I need to buy two fresh chicken fillets",
    phraseEsp: "Necesito comprar dos filetes de pollo fresco",
    gapText: "The ___ cut the beef very precisely.",
    gapWord: "butcher",
    gapOptions: ["butcher", "waiter", "cashier", "teacher"]
  },
  {
    id: "m-super-10",
    level: "intermedio",
    title: "Supermercado: Productos de Limpieza",
    description: "Localiza desinfectantes, jabón para platos y detergente de ropa.",
    vocab: ["Clean", "Soap", "Detergent", "Spray"],
    vocabTrans: ["Limpieza", "Jabón", "Detergente", "Aerosol"],
    phraseEng: "Where is the laundry detergent",
    phraseEsp: "¿Dónde está el detergente de ropa?",
    gapText: "Wash your hands with warm water and ___.",
    gapWord: "soap",
    gapOptions: ["soap", "milk", "bread", "soup"]
  },

  // CATEGORIA 3: HOTEL (10)
  {
    id: "m-hotel-1",
    level: "basico",
    title: "Hotel: Reservar Habitación",
    description: "Solicita una habitación limpia para pasar la noche cómodamente.",
    vocab: ["Hotel", "Room", "Stay", "Night"],
    vocabTrans: ["Hotel", "Habitación", "Quedarse", "Noche"],
    phraseEng: "I want a clean room for three nights",
    phraseEsp: "Quiero una habitación limpia por tres noches",
    gapText: "This five-star ___ is elegant and cheap.",
    gapWord: "hotel",
    gapOptions: ["hotel", "park", "store", "bus"]
  },
  {
    id: "m-hotel-2",
    level: "basico",
    title: "Hotel: Check-In en Recepción",
    description: "Presenta tus datos de reservación y recibe la llave de tu cuarto.",
    vocab: ["Key", "Reception", "Name", "Welcome"],
    vocabTrans: ["Llave", "Recepción", "Nombre", "Bienvenido"],
    phraseEng: "Can I get my electronic room key",
    phraseEsp: "¿Puedo obtener la llave electrónica de mi habitación?",
    gapText: "Please sign your name at the ___.",
    gapWord: "reception",
    gapOptions: ["reception", "restaurant", "swimming", "bathroom"]
  },
  {
    id: "m-hotel-3",
    level: "basico",
    title: "Hotel: Toallas Limpias",
    description: "Llama a recepción si necesitas más toallas o papel de baño.",
    vocab: ["Towel", "Bathroom", "Clean", "Need"],
    vocabTrans: ["Toalla", "Baño", "Limpio", "Necesitar"],
    phraseEng: "I need two clean towels for the shower",
    phraseEsp: "Necesito dos toallas limpias para la ducha",
    gapText: "The floor of the ___ is very wet.",
    gapWord: "bathroom",
    gapOptions: ["bathroom", "lobby", "garage", "garden"]
  },
  {
    id: "m-hotel-4",
    level: "intermedio",
    title: "Hotel: Servicio al Cuarto",
    description: "Ordena ricas cenas directo a la comodidad de tu cama.",
    vocab: ["Service", "Room", "Order", "Dinner"],
    vocabTrans: ["Servicio", "Cuarto", "Ordenar", "Cena"],
    phraseEng: "Hello room service I want to order a salad",
    phraseEsp: "Hola servicio al cuarto quiero ordenar una ensalada",
    gapText: "Can we call room ___ for hot coffee?",
    gapWord: "service",
    gapOptions: ["service", "card", "bill", "table"]
  },
  {
    id: "m-hotel-5",
    level: "basico",
    title: "Hotel: Contraseña del Wi-Fi",
    description: "Pregunta por el acceso inalámbrico a internet en el hotel.",
    vocab: ["Internet", "Password", "Free", "Connection"],
    vocabTrans: ["Internet", "Contraseña", "Gratis", "Conexión"],
    phraseEng: "What is the wireless internet password",
    phraseEsp: "¿Cuál es la contraseña del internet inalámbrico?",
    gapText: "The hotel offers ___ high speed internet.",
    gapWord: "free",
    gapOptions: ["free", "expensive", "slow", "heavy"]
  },
  {
    id: "m-hotel-6",
    level: "intermedio",
    title: "Hotel: Piscina y Sauna",
    description: "Disfruta de las instalaciones deportivas y lúdicas del recinto.",
    vocab: ["Pool", "Swim", "Towel", "Rules"],
    vocabTrans: ["Piscina", "Nadar", "Toalla", "Reglas"],
    phraseEng: "The swimming pool opens early at seven",
    phraseEsp: "La piscina de natación abre temprano a las siete",
    gapText: "Do not forget to ___ in the morning.",
    gapWord: "swim",
    gapOptions: ["swim", "eat", "buy", "sleep"]
  },
  {
    id: "m-hotel-7",
    level: "intermedio",
    title: "Hotel: Cama Matrimonial",
    description: "Solicita una cama King Size o almohadas cómodas extra.",
    vocab: ["Bed", "Pillow", "Soft", "Sleep"],
    vocabTrans: ["Cama", "Almohada", "Suave", "Dormir"],
    phraseEng: "These pillows are extremely soft and comfortable",
    phraseEsp: "Estas almohadas son extremadamente suaves y cómodas",
    gapText: "The double ___ is perfect for two adults.",
    gapWord: "bed",
    gapOptions: ["bed", "kitchen", "door", "window"]
  },
  {
    id: "m-hotel-8",
    level: "intermedio",
    title: "Hotel: Check-Out y Facturación",
    description: "Entrega la llave y paga los cargos adicionales al salir.",
    vocab: ["Checkout", "Bill", "Leave", "Additional"],
    vocabTrans: ["Salida", "Cuenta", "Irse", "Adicional"],
    phraseEng: "I am ready for the checkout process",
    phraseEsp: "Estoy listo para el proceso de salida",
    gapText: "We must ___ the hotel before noon.",
    gapWord: "leave",
    gapOptions: ["leave", "stay", "order", "clean"]
  },
  {
    id: "m-hotel-9",
    level: "intermedio",
    title: "Hotel: Aire Acondicionado",
    description: "Regula la temperatura interna de tu habitación para estar a gusto.",
    vocab: ["AC", "Remote", "Cold", "Temperature"],
    vocabTrans: ["Aire", "Control", "Frío", "Temperatura"],
    phraseEng: "Can I get a remote control for the AC",
    phraseEsp: "¿Puedo obtener un control remoto para el aire acondicionado?",
    gapText: "The room is too hot please turn on the ___.",
    gapWord: "AC",
    gapOptions: ["AC", "fridge", "oven", "tv"]
  },
  {
    id: "m-hotel-10",
    level: "avanzado",
    title: "Hotel: Servicio de Conserjería",
    description: "Habla con el conserje para reservar obras de teatro o taxis de noche.",
    vocab: ["Concierge", "Booking", "Tour", "Recommend"],
    vocabTrans: ["Conserje", "Reserva", "Tour", "Recomendar"],
    phraseEng: "The concierge booked a premium city tour for us",
    phraseEsp: "El conserje reservó un tour premium de la ciudad para nosotros",
    gapText: "Ask the ___ for restaurant recommendations.",
    gapWord: "concierge",
    gapOptions: ["concierge", "waiter", "cashier", "doctor"]
  },

  // CATEGORIA 4: AEROPUERTO (10)
  {
    id: "m-air-1",
    level: "basico",
    title: "Aeropuerto: El Pasaporte",
    description: "Lleva siempre contigo tu documento de identidad internacional.",
    vocab: ["Passport", "Id", "Border", "Officer"],
    vocabTrans: ["Pasaporte", "Identidad", "Frontera", "Oficial"],
    phraseEng: "Please show your valid passport at checkin",
    phraseEsp: "Por favor muestra tu pasaporte válido en el registro",
    gapText: "I locked my ___ inside my jacket pocket.",
    gapWord: "passport",
    gapOptions: ["passport", "keys", "wallet", "ticket"]
  },
  {
    id: "m-air-2",
    level: "basico",
    title: "Aeropuerto: Puerta de Embarque",
    description: "Encuentra la puerta correcta asignada a tu vuelo en las pantallas.",
    vocab: ["Gate", "Flight", "Boarding", "Screen"],
    vocabTrans: ["Puerta", "Vuelo", "Embarque", "Pantalla"],
    phraseEng: "Our flight departs from gate number fifteen",
    phraseEsp: "Nuestro vuelo sale de la puerta número quince",
    gapText: "Wait at the boarding ___ for instructions.",
    gapWord: "gate",
    gapOptions: ["gate", "car", "hotel", "aisle"]
  },
  {
    id: "m-air-3",
    level: "basico",
    title: "Aeropuerto: Equipaje de Mano",
    description: "Asegúrate de cumplir con el tamaño máximo permitido en la cabina.",
    vocab: ["Luggage", "Cabin", "Weight", "Bag"],
    vocabTrans: ["Equipaje", "Cabina", "Peso", "Bolsa"],
    phraseEng: "I only carry one private cabin bag",
    phraseEsp: "Solo llevo una bolsa de cabina privada",
    gapText: "The airline checked the heavy ___.",
    gapWord: "luggage",
    gapOptions: ["luggage", "food", "passport", "name"]
  },
  {
    id: "m-air-4",
    level: "intermedio",
    title: "Aeropuerto: Retraso de Vuelo",
    description: "Entiende los anuncios cuando hay demoras por el mal clima.",
    vocab: ["Delay", "Weather", "Late", "Hours"],
    vocabTrans: ["Retraso", "Clima", "Tarde", "Horas"],
    phraseEng: "The flight is delayed due to winter snow",
    phraseEsp: "El vuelo está retrasado debido a la nieve de invierno",
    gapText: "We have an unexpected flight ___.",
    gapWord: "delay",
    gapOptions: ["delay", "ticket", "gate", "luggage"]
  },
  {
    id: "m-air-5",
    level: "intermedio",
    title: "Aeropuerto: Equipaje Perdido",
    description: "Aprende a reportar si tu maleta no sale en las bandas de entrega.",
    vocab: ["Lost", "Suitcase", "Report", "Tag"],
    vocabTrans: ["Perdido", "Maleta", "Reporte", "Etiqueta"],
    phraseEng: "I need to file a lost suitcase report",
    phraseEsp: "Necesito llenar un reporte de maleta perdida",
    gapText: "The black ___ never arrived on the belt.",
    gapWord: "suitcase",
    gapOptions: ["suitcase", "passport", "ticket", "gate"]
  },
  {
    id: "m-air-6",
    level: "intermedio",
    title: "Aeropuerto: Control de Seguridad",
    description: "Quítate los zapatos y el cinturón para pasar la banda metálica.",
    vocab: ["Security", "Belt", "Shoes", "Metal"],
    vocabTrans: ["Seguridad", "Cinturón", "Zapatos", "Metal"],
    phraseEng: "Remove your shoes at the security checkpoint",
    phraseEsp: "Quítate los zapatos en el punto de control de seguridad",
    gapText: "The guard checked the laptop in ___.",
    gapWord: "security",
    gapOptions: ["security", "hotel", "kitchen", "store"]
  },
  {
    id: "m-air-7",
    level: "basico",
    title: "Aeropuerto: Asiento Ventana",
    description: "Elige entre un asiento en la ventana o cerca del pasillo central.",
    vocab: ["Seat", "Window", "Aisle", "Option"],
    vocabTrans: ["Asiento", "Ventana", "Pasillo", "Opción"],
    phraseEng: "I prefer a window seat to enjoy the sky",
    phraseEsp: "Prefiero un asiento de la ventana para disfrutar del cielo",
    gapText: "What is your airline ___ number?",
    gapWord: "seat",
    gapOptions: ["seat", "name", "passport", "bag"]
  },
  {
    id: "m-air-8",
    level: "intermedio",
    title: "Aeropuerto: Boleto y Boarding Pass",
    description: "Imprime o descarga el código QR para abordar rápido.",
    vocab: ["Boarding", "Pass", "Ticket", "Phone"],
    vocabTrans: ["Embarque", "Pase", "Boleto", "Teléfono"],
    phraseEng: "Keep your boarding pass and phone ready",
    phraseEsp: "Mantén tu pase de abordar y tu teléfono listos",
    gapText: "Show your digital boarding ___ to the crew.",
    gapWord: "pass",
    gapOptions: ["pass", "money", "jacket", "food"]
  },
  {
    id: "m-air-9",
    level: "avanzado",
    title: "Aeropuerto: Escala Corta",
    description: "Corre entre terminales si tienes poco tiempo de conexión.",
    vocab: ["Layover", "Connection", "Terminal", "Fast"],
    vocabTrans: ["Escala", "Conexión", "Terminal", "Rápido"],
    phraseEng: "I have a tight two hour layover in Miami",
    phraseEsp: "Tengo una escala ajustada de dos horas en Miami",
    gapText: "We had a long ___ in London airport.",
    gapWord: "layover",
    gapOptions: ["layover", "flight", "pilot", "ticket"]
  },
  {
    id: "m-air-10",
    level: "avanzado",
    title: "Aeropuerto: Declaración de Aduana",
    description: "Declara medicamentos, plantas o sumas grandes antes de ingresar.",
    vocab: ["Customs", "Declare", "Form", "Goods"],
    vocabTrans: ["Aduana", "Declarar", "Formulario", "Bienes"],
    phraseEng: "Do you have any private goods to declare",
    phraseEsp: "¿Tiene algún bien privado que declarar?",
    gapText: "Fill out the customs ___ before landing.",
    gapWord: "form",
    gapOptions: ["form", "gate", "bag", "seat"]
  },

  // CATEGORIA 5: RUTINA DIARIA (10)
  {
    id: "m-day-1",
    level: "basico",
    title: "Rutina: Despertarse temprano",
    description: "Vocabulario para comenzar tus mañanas con energía.",
    vocab: ["Wake", "Early", "Alarm", "Clock"],
    vocabTrans: ["Despertar", "Temprano", "Alarma", "Reloj"],
    phraseEng: "I wake up early because of my alarm",
    phraseEsp: "Me despierto temprano por mi alarma",
    gapText: "Set the daily ___ to six in the morning.",
    gapWord: "alarm",
    gapOptions: ["alarm", "coffee", "bed", "shower"]
  },
  {
    id: "m-day-2",
    level: "basico",
    title: "Rutina: Cepillarse los Dientes",
    description: "Aprende el vocabulario esencial de la higiene bucal diaria.",
    vocab: ["Teeth", "Brush", "Toothpaste", "Water"],
    vocabTrans: ["Dientes", "Cepillo", "Pasta", "Agua"],
    phraseEng: "Brush your teeth three times a day",
    phraseEsp: "Cepilla tus dientes tres veces al día",
    gapText: "Put clean ___ on your soft brush.",
    gapWord: "toothpaste",
    gapOptions: ["toothpaste", "juice", "sugar", "bread"]
  },
  {
    id: "m-day-3",
    level: "basico",
    title: "Rutina: Baño y Ducha",
    description: "Describe el aseo diario con agua caliente y jabón.",
    vocab: ["Shower", "Hot", "Soap", "Shampoo"],
    vocabTrans: ["Ducha", "Caliente", "Jabón", "Champú"],
    phraseEng: "I love taking a warm hot shower",
    phraseEsp: "Me encanta tomar una ducha tibia caliente",
    gapText: "Clean your body with organic ___.",
    gapWord: "soap",
    gapOptions: ["soap", "shampoo", "toothpaste", "water"]
  },
  {
    id: "m-day-4",
    level: "basico",
    title: "Rutina: El Desayuno",
    description: "Vocabulario familiar sobre la primera comida importante de la fecha.",
    vocab: ["Breakfast", "Eggs", "Toast", "Milk"],
    vocabTrans: ["Desayuno", "Huevos", "Tostada", "Leche"],
    phraseEng: "Breakfast is the most vital food",
    phraseEsp: "El desayuno es la comida más vital",
    gapText: "We eat buttered ___ and boiled eggs.",
    gapWord: "toast",
    gapOptions: ["toast", "juice", "sugar", "water"]
  },
  {
    id: "m-day-5",
    level: "intermedio",
    title: "Rutina: Limpiar la Casa",
    description: "Mantén tus espacios comunes limpios de polvo y suciedad.",
    vocab: ["Clean", "Dust", "Broom", "Floor"],
    vocabTrans: ["Limpiar", "Polvo", "Escoba", "Piso"],
    phraseEng: "Sweep the kitchen floor with a broom",
    phraseEsp: "Barre el suelo de la cocina con una escoba",
    gapText: "There is too much ___ on the television.",
    gapWord: "dust",
    gapOptions: ["dust", "soap", "water", "apple"]
  },
  {
    id: "m-day-6",
    level: "basico",
    title: "Rutina: Lavar la Ropa",
    description: "Pon tu ropa sucia a lavar en la lavadora del hogar.",
    vocab: ["Laundry", "Wash", "Dirty", "Dryer"],
    vocabTrans: ["Ropa sucia", "Lavar", "Sucio", "Secadora"],
    phraseEng: "I do my dirty laundry on Sunday morning",
    phraseEsp: "Hago mi ropa sucia los domingos por la mañana",
    gapText: "Put the dirty tshirts in the ___ machine.",
    gapWord: "wash",
    gapOptions: ["wash", "dry", "eat", "play"]
  },
  {
    id: "m-day-7",
    level: "basico",
    title: "Rutina: Regar las Plantas",
    description: "Mantén vivas las flores de tu jardín regándolas con frecuencia.",
    vocab: ["Water", "Plants", "Garden", "Flowers"],
    vocabTrans: ["Agua", "Plantas", "Jardín", "Flores"],
    phraseEng: "Remember to water the garden flowers today",
    phraseEsp: "Recuerda regar las flores del jardín hoy",
    gapText: "Organic green ___ need direct sunlight.",
    gapWord: "plants",
    gapOptions: ["plants", "dogs", "cups", "books"]
  },
  {
    id: "m-day-8",
    level: "basico",
    title: "Rutina: Pasear al Perro",
    description: "Saca a caminar a tu mascota para que corra y se ejercite.",
    vocab: ["Walk", "Dog", "Leash", "Park"],
    vocabTrans: ["Caminar", "Perro", "Correa", "Parque"],
    phraseEng: "Always put a safe leash on your dog",
    phraseEsp: "Siempre ponle una correa segura a tu perro",
    gapText: "Let's take a nice ___ around the neighborhood.",
    gapWord: "walk",
    gapOptions: ["walk", "car", "sleep", "eat"]
  },
  {
    id: "m-day-9",
    level: "intermedio",
    title: "Rutina: Preparar Café Fuerte",
    description: "Muele granos y prepara café caliente para mantenerte despierto.",
    vocab: ["Coffee", "Mug", "Hot", "Energy"],
    vocabTrans: ["Café", "Taza", "Caliente", "Energía"],
    phraseEng: "I fill my big mug with hot coffee",
    phraseEsp: "Lleno mi taza grande con café caliente",
    gapText: "Drinking coffee gives me high ___.",
    gapWord: "energy",
    gapOptions: ["energy", "sleep", "cold", "pain"]
  },
  {
    id: "m-day-10",
    level: "basico",
    title: "Rutina: Ir a Dormir",
    description: "Desconéctate de las pantallas y duerme plácidamente en tu cama.",
    vocab: ["Sleep", "Bed", "Night", "Dream"],
    vocabTrans: ["Dormir", "Cama", "Noche", "Sueño"],
    phraseEng: "It is late let us sleep in our bed",
    phraseEsp: "Es tarde vamos a dormir en nuestra cama",
    gapText: "I had a beautiful ___ last night.",
    gapWord: "dream",
    gapOptions: ["dream", "food", "car", "street"]
  },

  // CATEGORIA 6: SALUD Y BIENESTAR (10)
  {
    id: "m-health-1",
    level: "basico",
    title: "Salud: Al Doctor",
    description: "Expresa de forma básica que te sientes enfermo y necesitas atención.",
    vocab: ["Doctor", "Sick", "Pain", "Hospital"],
    vocabTrans: ["Doctor", "Enfermo", "Dolor", "Hospital"],
    phraseEng: "I am sick I need to see the doctor",
    phraseEsp: "Estoy enfermo necesito ver al doctor",
    gapText: "Call the emergency ___ if you are heavily injured.",
    gapWord: "hospital",
    gapOptions: ["hospital", "hotel", "supermarket", "school"]
  },
  {
    id: "m-health-2",
    level: "basico",
    title: "Salud: Comprar Jarabe",
    description: "Compra remedios para el resfriado en la farmacia más cercana.",
    vocab: ["Syrup", "Cough", "Pharmacy", "Pills"],
    vocabTrans: ["Jarabe", "Tos", "Farmacia", "Pastillas"],
    phraseEng: "This sweet cough syrup works very well",
    phraseEsp: "Este jarabe dulce para la tos funciona muy bien",
    gapText: "Go to the ___ to get your medication.",
    gapWord: "pharmacy",
    gapOptions: ["pharmacy", "bakery", "restaurant", "airport"]
  },
  {
    id: "m-health-3",
    level: "basico",
    title: "Salud: Dolor de Cabeza",
    description: "Explica que tienes migraña y necesitas descansar un momento.",
    vocab: ["Headache", "Rest", "Water", "Pill"],
    vocabTrans: ["Dolor de cabeza", "Descanso", "Agua", "Pastilla"],
    phraseEng: "I need to rest due to a bad headache",
    phraseEsp: "Necesito descansar debido a un mal dolor de cabeza",
    gapText: "Take this white ___ to cure the pain.",
    gapWord: "pill",
    gapOptions: ["pill", "sugar", "apple", "milk"]
  },
  {
    id: "m-health-4",
    level: "intermedio",
    title: "Salud: Cita con Dentista",
    description: "Haz una cita para limpieza dental u otra molestia bucal.",
    vocab: ["Dentist", "Cavity", "Tooth", "Appointment"],
    vocabTrans: ["Dentista", "Carie", "Diente", "Cita"],
    phraseEng: "I scheduled an appointment with the dentist",
    phraseEsp: "Programé una cita con el dentista",
    gapText: "My front ___ hurts when I eat ice cream.",
    gapWord: "tooth",
    gapOptions: ["tooth", "finger", "hair", "eye"]
  },
  {
    id: "m-health-5",
    level: "basico",
    title: "Salud: Vitaminas Diarias",
    description: "Suplementos de salud para fortalecer tus defensas corporales.",
    vocab: ["Vitamins", "Body", "Healthy", "Strong"],
    vocabTrans: ["Vitaminas", "Cuerpo", "Saludable", "Fuerte"],
    phraseEng: "Taking vitamins will make your body strong",
    phraseEsp: "Tomar vitaminas hará fuerte tu cuerpo",
    gapText: "A healthy diet keeps the immune system ___.",
    gapWord: "strong",
    gapOptions: ["strong", "weak", "sad", "cold"]
  },
  {
    id: "m-health-6",
    level: "basico",
    title: "Salud: Beber Agua",
    description: "La regla de oro para la hidratación y buena digestión.",
    vocab: ["Water", "Drink", "Glass", "Hydration"],
    vocabTrans: ["Agua", "Beber", "Vaso", "Hidratación"],
    phraseEng: "Drink eight glasses of clear water daily",
    phraseEsp: "Bebe ocho vasos de agua clara al día",
    gapText: "We must ___ clean water after running.",
    gapWord: "drink",
    gapOptions: ["drink", "eat", "write", "buy"]
  },
  {
    id: "m-health-7",
    level: "intermedio",
    title: "Salud: Una Fractura Menor",
    description: "Aprende a describir cuando tienes un brazo o pierna enyesada.",
    vocab: ["Broken", "Arm", "Cast", "Injury"],
    vocabTrans: ["Roto", "Brazo", "Yeso", "Lesión"],
    phraseEng: "I broke my left arm playing soccer",
    phraseEsp: "Me rompí mi brazo izquierdo jugando fútbol",
    gapText: "The doctor put a white ___ on my broken hand.",
    gapWord: "cast",
    gapOptions: ["cast", "shirt", "shoe", "ring"]
  },
  {
    id: "m-health-8",
    level: "intermedio",
    title: "Salud: Receta del Doctor",
    description: "La hoja oficial con las instrucciones del tratamiento médico.",
    vocab: ["Prescription", "Medicine", "Dose", "Pharmacy"],
    vocabTrans: ["Receta", "Medicina", "Dosis", "Farmacia"],
    phraseEng: "I have the medical prescription for antibiotics",
    phraseEsp: "Tengo la receta médica para los antibióticos",
    gapText: "Take this official ___ to buy the medicine.",
    gapWord: "prescription",
    gapOptions: ["prescription", "receipt", "form", "card"]
  },
  {
    id: "m-health-9",
    level: "basico",
    title: "Salud: Dormir bien",
    description: "Cura el cansancio físico y mental con un merecido sueño.",
    vocab: ["Sleep", "Hours", "Night", "Health"],
    vocabTrans: ["Dormir", "Horas", "Noche", "Salud"],
    phraseEng: "Sleeping eight hours at night is healthy",
    phraseEsp: "Dormir ocho horas por la noche es saludable",
    gapText: "Continuous bad sleep damages your general ___.",
    gapWord: "health",
    gapOptions: ["health", "money", "house", "car"]
  },
  {
    id: "m-health-10",
    level: "avanzado",
    title: "Salud: Botiquín Emergencias",
    description: "Primeros auxilios obligatorios en el lugar de trabajo o coche.",
    vocab: ["First-aid", "Kit", "Bandage", "Safety"],
    vocabTrans: ["Primeros auxilios", "Botiquín", "Vendaje", "Seguridad"],
    phraseEng: "Every car needs a complete first-aid kit",
    phraseEsp: "Cada coche necesita un botiquín de primeros auxilios completo",
    gapText: "We wrapped the bleeding cut with a clean ___.",
    gapWord: "bandage",
    gapOptions: ["bandage", "soap", "sugar", "water"]
  },

  // CATEGORIA 7: RECREACION Y CIUDAD (10)
  {
    id: "m-city-1",
    level: "intermedio",
    title: "Ciudad: Visitar el Museo",
    description: "Observa pinturas clásicas e increíbles fósiles en las galerías.",
    vocab: ["Museum", "Art", "Painting", "Ticket"],
    vocabTrans: ["Museo", "Arte", "Pintura", "Boleto"],
    phraseEng: "The local museum is free on Sunday",
    phraseEsp: "El museo local es gratis los domingos",
    gapText: "Look at that beautiful oil ___ on the wall.",
    gapWord: "painting",
    gapOptions: ["painting", "dog", "pen", "table"]
  },
  {
    id: "m-city-2",
    level: "basico",
    title: "Ciudad: Ir Al Cine",
    description: "Disfruta de tus películas preferidas comiendo palomitas.",
    vocab: ["Cinema", "Movie", "Popcorn", "Seat"],
    vocabTrans: ["Cine", "Película", "Palomitas", "Asiento"],
    phraseEng: "I love buying warm popcorn at cinema",
    phraseEsp: "Me encanta comprar palomitas calientes en el cine",
    gapText: "The new action ___ starts in ten minutes.",
    gapWord: "movie",
    gapOptions: ["movie", "game", "book", "song"]
  },
  {
    id: "m-city-3",
    level: "basico",
    title: "Ciudad: Tarde en el Parque",
    description: "Respira aire fresco a la sombra de grandes árboles.",
    vocab: ["Park", "Tree", "Bench", "Grass"],
    vocabTrans: ["Parque", "Árbol", "Lugar", "Pasto"],
    phraseEng: "Let's read a book on the green grass",
    phraseEsp: "Leamos un libro en el pasto verde",
    gapText: "I sat down on a public ___ to rest.",
    gapWord: "bench",
    gapOptions: ["bench", "car", "cloud", "boat"]
  },
  {
    id: "m-city-4",
    level: "basico",
    title: "Ciudad: Ejercicio en el Gym",
    description: "Suda la camiseta corriendo en las cintas automáticas.",
    vocab: ["Gym", "Workout", "Run", "Healthy"],
    vocabTrans: ["Gimnasio", "Entrenamiento", "Correr", "Saludable"],
    phraseEng: "A daily workout keeps your body active",
    phraseEsp: "Un entrenamiento diario mantiene tu cuerpo activo",
    gapText: "I lift heavy weights at the ___.",
    gapWord: "gym",
    gapOptions: ["gym", "office", "cinema", "hotel"]
  },
  {
    id: "m-city-5",
    level: "intermedio",
    title: "Ciudad: Visitar el Zoológico",
    description: "Aprende de especies salvajes en el zoológico metropolitano.",
    vocab: ["Zoo", "Animals", "Lion", "Tiger"],
    vocabTrans: ["Zoológico", "Animales", "León", "Tigre"],
    phraseEng: "The zoo has realistic habitats for wild tigers",
    phraseEsp: "El zoológico tiene hábitats realistas para tigres salvajes",
    gapText: "Children love to see the heavy ___ of Africa.",
    gapWord: "animals",
    gapOptions: ["animals", "cars", "books", "planes"]
  },
  {
    id: "m-city-6",
    level: "basico",
    title: "Ciudad: Ir de Compras",
    description: "Trata de buscar camisas y pantalones de tu talla y color favorito.",
    vocab: ["Mall", "Clothes", "Shirt", "Buying"],
    vocabTrans: ["Centro comercial", "Ropa", "Camisa", "Comprar"],
    phraseEng: "We are buying fancy clothes at the mall",
    phraseEsp: "Estamos comprando ropa elegante en el centro comercial",
    gapText: "My black ___ is dirty I need to wash it.",
    gapWord: "shirt",
    gapOptions: ["shirt", "apple", "key", "bill"]
  },
  {
    id: "m-city-7",
    level: "intermedio",
    title: "Ciudad: La Biblioteca Pública",
    description: "Busca novelas y enciclopedias en silencio total.",
    vocab: ["Library", "Book", "Quiet", "Read"],
    vocabTrans: ["Biblioteca", "Libro", "Silencio", "Leer"],
    phraseEng: "Please keep quiet in the public library",
    phraseEsp: "Por favor mantente en silencio en la biblioteca pública",
    gapText: "I want to borrow an interesting science ___.",
    gapWord: "book",
    gapOptions: ["book", "bread", "soap", "shoe"]
  },
  {
    id: "m-city-8",
    level: "basico",
    title: "Ciudad: Tomar un Café",
    description: "Sal con un amigo por un espresso bien cargado.",
    vocab: ["Cafe", "Coffee", "Friend", "Talk"],
    vocabTrans: ["Cafetería", "Café", "Amigo", "Hablar"],
    phraseEng: "Let us meet at the local street cafe",
    phraseEsp: "Reunámonos en la cafetería local de la calle",
    gapText: "I love drinking hot coffee with my ___.",
    gapWord: "friend",
    gapOptions: ["friend", "car", "envelope", "pen"]
  },
  {
    id: "m-city-9",
    level: "intermedio",
    title: "Ciudad: El Teatro Local",
    description: "Disfruta de representaciones artísticas y musicales en vivo.",
    vocab: ["Theater", "Play", "Actor", "Stage"],
    vocabTrans: ["Teatro", "Obra", "Actor", "Escenario"],
    phraseEng: "The actor stepped onto the central stage",
    phraseEsp: "El actor subió al escenario central",
    gapText: "We bought good tickets for the night ___.",
    gapWord: "play",
    gapOptions: ["play", "food", "milk", "egg"]
  },
  {
    id: "m-city-10",
    level: "avanzado",
    title: "Ciudad: El Festival de Música",
    description: "Baila al aire libre con tus bandas favoritas del año.",
    vocab: ["Festival", "Music", "Crowd", "Tickets"],
    vocabTrans: ["Festival", "Música", "Multitud", "Boletos"],
    phraseEng: "The rock music festival attracts huge crowds",
    phraseEsp: "El festival de música rock atrae a enormes multitudes",
    gapText: "The local energetic ___ danced all night long.",
    gapWord: "crowd",
    gapOptions: ["crowd", "doctor", "cashier", "waiter"]
  },

  // CATEGORIA 8: TRABAJO Y COMPUTACIÓN (10)
  {
    id: "m-work-1",
    level: "intermedio",
    title: "Oficina: Reunión de Equipo",
    description: "Participa de forma activa en el reporte diario de avances.",
    vocab: ["Meeting", "Team", "Report", "Project"],
    vocabTrans: ["Reunión", "Equipo", "Reporte", "Proyecto"],
    phraseEng: "Our weekly team meeting is at nine AM",
    phraseEsp: "Nuestra reunión semanal de equipo es a las nueve AM",
    gapText: "We need to finish this software ___ today.",
    gapWord: "project",
    gapOptions: ["project", "dinner", "flight", "chair"]
  },
  {
    id: "m-work-2",
    level: "basico",
    title: "Oficina: Enviar un Correo",
    description: "Redacta de manera profesional mensajes clave a tu supervisor.",
    vocab: ["Email", "Send", "Subject", "Inbox"],
    vocabTrans: ["Correo", "Enviar", "Asunto", "Bandeja"],
    phraseEng: "Send me the final files via business email",
    phraseEsp: "Envíame los archivos finales por correo comercial",
    gapText: "Did you click on the ___ button?",
    gapWord: "send",
    gapOptions: ["send", "drink", "sleep", "eat"]
  },
  {
    id: "m-work-3",
    level: "intermedio",
    title: "Oficina: Nueva Laptop",
    description: "Configura las contraseñas e instala herramientas de desarrollo.",
    vocab: ["Laptop", "Screen", "Keyboard", "Power"],
    vocabTrans: ["Laptop", "Pantalla", "Teclado", "Encender"],
    phraseEng: "The screen of my laptop is very bright",
    phraseEsp: "La pantalla de mi laptop es muy brillante",
    gapText: "Type your code on the external black ___.",
    gapWord: "keyboard",
    gapOptions: ["keyboard", "shampoo", "butter", "milk"]
  },
  {
    id: "m-work-4",
    level: "basico",
    title: "Oficina: Organizar Escritorio",
    description: "Coloca cada cosa en su lugar para mantener la concentración.",
    vocab: ["Desk", "Chair", "Notebook", "Pen"],
    vocabTrans: ["Escritorio", "Silla", "Libreta", "Pluma"],
    phraseEng: "My office desk is extremely clean",
    phraseEsp: "Mi escritorio de oficina está extremadamente limpio",
    gapText: "Write the ideas down on your private ___.",
    gapWord: "notebook",
    gapOptions: ["notebook", "pizza", "water", "soap"]
  },
  {
    id: "m-work-5",
    level: "avanzado",
    title: "Oficina: Trabajo Remoto",
    description: "Beneficios y retos de laborar directamente desde tu departamento.",
    vocab: ["Remote", "Home", "Internet", "Calls"],
    vocabTrans: ["Remoto", "Hogar", "Internet", "Llamadas"],
    phraseEng: "I work remote from home because I love it",
    phraseEsp: "Trabajo remoto desde casa porque me encanta",
    gapText: "High speed ___ is ideal for virtual meetings.",
    gapWord: "internet",
    gapOptions: ["internet", "bread", "syrup", "cart"]
  },
  {
    id: "m-work-6",
    level: "avanzado",
    title: "Oficina: El Jefe",
    description: "Habla con respeto y asertividad con la gerencia general.",
    vocab: ["Boss", "Manager", "Decision", "Business"],
    vocabTrans: ["Jefe", "Gerente", "Decisión", "Negocio"],
    phraseEng: "The departments boss approved our budget proposal",
    phraseEsp: "El jefe del departamento aprobó nuestra propuesta de presupuesto",
    gapText: "The creative ___ decided to hire more workers.",
    gapWord: "manager",
    gapOptions: ["manager", "waiter", "butcher", "doctor"]
  },
  {
    id: "m-work-7",
    level: "intermedio",
    title: "Oficina: Pausa para Té",
    description: "Despéjate cinco minutos platicando con tus jefes o colegas.",
    vocab: ["Break", "Tea", "Talk", "Colleague"],
    vocabTrans: ["Pausa", "Té", "Hablar", "Colega"],
    phraseEng: "Let's take a quick fifteen minute break",
    phraseEsp: "Tomemos un breve descanso de quince minutos",
    gapText: "My office ___ is friendly and helps me.",
    gapWord: "colleague",
    gapOptions: ["colleague", "doctor", "waiter", "lion"]
  },
  {
    id: "m-work-8",
    level: "avanzado",
    title: "Oficina: Aumento de Sueldo",
    description: "Presenta tus excelentes métricas anuales para justificar un aumento.",
    vocab: ["Raise", "Salary", "Performance", "Metrics"],
    vocabTrans: ["Aumento", "Salario", "Rendimiento", "Métricas"],
    phraseEng: "Our boss gave us a generous salary raise",
    phraseEsp: "Nuestro jefe nos dio un aumento de salario generoso",
    gapText: "The annual worker evaluation measured direct ___.",
    gapWord: "performance",
    gapOptions: ["performance", "soup", "gate", "pill"]
  },
  {
    id: "m-work-9",
    level: "avanzado",
    title: "Oficina: Firmar Contrato",
    description: "Revisa las cláusulas y beneficios de salud antes de firmar.",
    vocab: ["Sign", "Contract", "Document", "Job"],
    vocabTrans: ["Firmar", "Contrato", "Documento", "Trabajo"],
    phraseEng: "Please sign the official employment contract today",
    phraseEsp: "Por favor firma el contrato de trabajo oficial hoy",
    gapText: "I accepted the exciting new corporate ___.",
    gapWord: "job",
    gapOptions: ["job", "room", "lake", "ticket"]
  },
  {
    id: "m-work-10",
    level: "avanzado",
    title: "Oficina: Presentación Anual",
    description: "Habla frente al comité directivo sobre tus metas estratégicas.",
    vocab: ["Presentation", "Slides", "Goals", "Strategy"],
    vocabTrans: ["Presentación", "Diapositivas", "Metas", "Estrategia"],
    phraseEng: "My slides for the public presentation are ready",
    phraseEsp: "Mis diapositivas para la presentación pública están listas",
    gapText: "Align the corporate ___ with current assets.",
    gapWord: "strategy",
    gapOptions: ["strategy", "food", "shampoo", "sugar"]
  },

  // CATEGORIA 9: NATURALEZA Y ANIMALES (10)
  {
    id: "m-nat-1",
    level: "basico",
    title: "Naturaleza: Caminar por la Montaña",
    description: "Frases de aventura cruzando senderos rocosos y de altura.",
    vocab: ["Mountain", "Hike", "Forest", "Fresh"],
    vocabTrans: ["Montaña", "Caminata", "Bosque", "Fresco"],
    phraseEng: "We will hike the high snow mountain",
    phraseEsp: "Caminaremos por la alta montaña nevada",
    gapText: "This fresh pine ___ smells incredible.",
    gapWord: "forest",
    gapOptions: ["forest", "office", "hotel", "airport"]
  },
  {
    id: "m-nat-2",
    level: "basico",
    title: "Naturaleza: Nadar en el Río",
    description: "Siente el frescor del agua dulce y limpia bajo el sol caliente.",
    vocab: ["River", "Swim", "Clear", "Sun"],
    vocabTrans: ["Río", "Nadar", "Claro", "Sol"],
    phraseEng: "The water of the forest river is clear",
    phraseEsp: "El agua del río del bosque está clara",
    gapText: "Let us go ___ in the clean river.",
    gapWord: "swimming",
    gapOptions: ["swimming", "eating", "reading", "cooking"]
  },
  {
    id: "m-nat-3",
    level: "basico",
    title: "Naturaleza: Ver el Atardecer",
    description: "Disfruta de la caída de la noche con cielos rojizos.",
    vocab: ["Sunset", "Sky", "Beautiful", "Red"],
    vocabTrans: ["Atardecer", "Cielo", "Hermoso", "Rojo"],
    phraseEng: "This beautiful sunset turns the sky red",
    phraseEsp: "Este hermoso atardecer vuelve rojo el cielo",
    gapText: "Look at the stars shining in the ___.",
    gapWord: "sky",
    gapOptions: ["sky", "ground", "bag", "cart"]
  },
  {
    id: "m-nat-4",
    level: "basico",
    title: "Naturaleza: El Clima Lluvioso",
    description: "Usa botas plásticas o paraguas para pasear en la lluvia.",
    vocab: ["Rain", "Umbrella", "Wet", "Boots"],
    vocabTrans: ["Lluvia", "Paraguas", "Mojado", "Botas"],
    phraseEng: "Bring your yellow umbrella it will rain",
    phraseEsp: "Trae tu paraguas amarillo lloverá",
    gapText: "The grassy field of the park is very ___.",
    gapWord: "wet",
    gapOptions: ["wet", "dry", "hot", "sweet"]
  },
  {
    id: "m-nat-5",
    level: "basico",
    title: "Naturaleza: Capibaras en su Hábitat",
    description: "Aprende del mamífero roedor más adorable y amigable del mundo.",
    vocab: ["Capybara", "Friendly", "Water", "Nature"],
    vocabTrans: ["Capibara", "Amigable", "Agua", "Naturaleza"],
    phraseEng: "The capybara is a friendly swamp animal",
    phraseEsp: "El capibara es un animal amigable del pantano",
    gapText: "Capi Loves swimming in hot hot ___.",
    gapWord: "water",
    gapOptions: ["water", "juice", "soda", "wine"]
  },
  {
    id: "m-nat-6",
    level: "basico",
    title: "Naturaleza: Estrellas de Noche",
    description: "Busca constelaciones celestes alejándote del ruido lumínico nocturno.",
    vocab: ["Stars", "Night", "Camping", "Sky"],
    vocabTrans: ["Estrellas", "Noche", "Acampar", "Cielo"],
    phraseEng: "We camp tonight under millions of stars",
    phraseEsp: "Acampamos esta noche bajo millones de estrellas",
    gapText: "We went ___ for the weekend.",
    gapWord: "camping",
    gapOptions: ["camping", "cooking", "swimming", "working"]
  },
  {
    id: "m-nat-7",
    level: "intermedio",
    title: "Naturaleza: Plantar un Árbol",
    description: "Ayuda a capturar emisiones nocivas plantando variedades locales.",
    vocab: ["Plant", "Tree", "Earth", "Green"],
    vocabTrans: ["Plantar", "Árbol", "Tierra", "Verde"],
    phraseEng: "Planting a green tree helps our Earth",
    phraseEsp: "Plantar un árbol verde ayuda a nuestra Tierra",
    gapText: "The roots of the forest ___ are deep.",
    gapWord: "tree",
    gapOptions: ["tree", "dog", "pen", "desk"]
  },
  {
    id: "m-nat-8",
    level: "intermedio",
    title: "Naturaleza: Observar Aves",
    description: "Utiliza binoculares potentes para rastrear tucanes y loros.",
    vocab: ["Birds", "Forest", "Singing", "Sky"],
    vocabTrans: ["Pájaros", "Bosque", "Cantando", "Cielo"],
    phraseEng: "The tropical birds are singing beautifully",
    phraseEsp: "Los pájaros tropicales están cantando bellamente",
    gapText: "Look at the colorful ___ flying high.",
    gapWord: "birds",
    gapOptions: ["birds", "cats", "chairs", "laptops"]
  },
  {
    id: "m-nat-9",
    level: "avanzado",
    title: "Naturaleza: Proteger la Tierra",
    description: "Conversaciones sobre el cuidado urgente del ecosistema global.",
    vocab: ["Protect", "Earth", "Pollution", "Recycle"],
    vocabTrans: ["Proteger", "Tierra", "Contaminación", "Reciclar"],
    phraseEng: "We must recycle plastic to protect Earth",
    phraseEsp: "Debemos reciclar plástico para proteger la Tierra",
    gapText: "Reduce toxic air ___ immediately.",
    gapWord: "pollution",
    gapOptions: ["pollution", "water", "juice", "bread"]
  },
  {
    id: "m-nat-10",
    level: "intermedio",
    title: "Naturaleza: El Lago Espejo",
    description: "Fotografía la majestuosidad de lagunas de aguas quietas.",
    vocab: ["Lake", "Water", "Mirror", "Reflection"],
    vocabTrans: ["Lago", "Agua", "Espejo", "Reflejo"],
    phraseEng: "The pure lake looks like a giant mirror",
    phraseEsp: "El lago puro parece un espejo gigante",
    gapText: "Fish swim safely in the clean deep ___.",
    gapWord: "lake",
    gapOptions: ["lake", "road", "terminal", "safe"]
  },

  // CATEGORIA 10: SOCIALIZANDO (10)
  {
    id: "m-soc-1",
    level: "basico",
    title: "Social: Hablar de Hermanos",
    description: "Platica sobre la cantidad de hermanos que tienes con cariño.",
    vocab: ["Brother", "Sister", "Family", "Love"],
    vocabTrans: ["Hermano", "Hermana", "Familia", "Amor"],
    phraseEng: "I live with my brother and my sister",
    phraseEsp: "Vivo con mi hermano y mi hermana",
    gapText: "The core of my life is my ___.",
    gapWord: "family",
    gapOptions: ["family", "car", "mall", "office"]
  },
  {
    id: "m-soc-2",
    level: "basico",
    title: "Social: Hacer Nuevos Amigos",
    description: "Preséntate en cualquier evento público con seguridad.",
    vocab: ["Friend", "Name", "Meet", "Happy"],
    vocabTrans: ["Amigo", "Nombre", "Conocer", "Feliz"],
    phraseEng: "I want to meet interesting new friends",
    phraseEsp: "Quiero conocer nuevos amigos interesantes",
    gapText: "Sofia was extremely ___ to receive the gift.",
    gapWord: "happy",
    gapOptions: ["happy", "cold", "pain", "late"]
  },
  {
    id: "m-soc-3",
    level: "basico",
    title: "Social: Ofrecer Ayuda",
    description: "Usa frases generosas para auxiliar a alguien cansado.",
    vocab: ["Help", "Need", "Offer", "Please"],
    vocabTrans: ["Ayudar", "Necesitar", "Ofrecer", "Por favor"],
    phraseEng: "How can I help you my friend",
    phraseEsp: "¿Cómo te puedo ayudar mi amigo?",
    gapText: "Do you ___ any clean water?",
    gapWord: "need",
    gapOptions: ["need", "eat", "cook", "buy"]
  },
  {
    id: "m-soc-4",
    level: "basico",
    title: "Social: Pedir Disculpas",
    description: "Ofrece disculpas sinceras si llegas tarde a una cita importante.",
    vocab: ["Sorry", "Late", "Traffic", "Forgive"],
    vocabTrans: ["Perdón", "Tarde", "Tráfico", "Perdonar"],
    phraseEng: "I am extremely sorry for being late",
    phraseEsp: "Siento muchísimo llegar tarde",
    gapText: "I missed the connection because of heavy ___.",
    gapWord: "traffic",
    gapOptions: ["traffic", "butter", "milk", "egg"]
  },
  {
    id: "m-soc-5",
    level: "intermedio",
    title: "Social: Cumpleaños Feliz",
    description: "Aprende vocabulario festivo sobre velas y deliciosos pasteles.",
    vocab: ["Birthday", "Happy", "Candle", "Wish"],
    vocabTrans: ["Cumpleaños", "Feliz", "Vela", "Deseo"],
    phraseEng: "Make a birthday wish and blow the candle",
    phraseEsp: "Haz un deseo de cumpleaños y sopla la vela",
    gapText: "Happy ___ to our favorite tutor Capi!",
    gapWord: "birthday",
    gapOptions: ["birthday", "hotel", "airport", "laundry"]
  },
  {
    id: "m-soc-6",
    level: "basico",
    title: "Social: Felicitaciones!",
    description: "Felicita a un compañero que acaba de pasar su examen inglés.",
    vocab: ["Congratulations", "Success", "Proud", "Exam"],
    vocabTrans: ["Felicidades", "Éxito", "Orgulloso", "Examen"],
    phraseEng: "I am proud of your test success",
    phraseEsp: "Estoy orgulloso de tu éxito en la prueba",
    gapText: "___ on completing your first module!",
    gapWord: "Congratulations",
    gapOptions: ["Congratulations", "No", "Sorry", "Yes"]
  },
  {
    id: "m-soc-7",
    level: "basico",
    title: "Social: Decir Gracias",
    description: "La palabra mágica universal para abrir todas las puertas del mundo.",
    vocab: ["Thanks", "Welcome", "Kind", "Help"],
    vocabTrans: ["Gracias", "Bienvenido", "Amable", "Ayuda"],
    phraseEng: "Many thanks for your kind advice",
    phraseEsp: "Muchas gracias por tu amable consejo",
    gapText: "You are always ___ to visit our swamp.",
    gapWord: "welcome",
    gapOptions: ["welcome", "late", "cold", "wet"]
  },
  {
    id: "m-soc-8",
    level: "intermedio",
    title: "Social: Compartir Juguetes",
    description: "Frases de integración para jugar de forma compartida en la escuela.",
    vocab: ["Share", "Toys", "Children", "Play"],
    vocabTrans: ["Compartir", "Juguetes", "Niños", "Jugar"],
    phraseEng: "Children learn to share their fun toys",
    phraseEsp: "Los niños aprenden a compartir sus juguetes divertidos",
    gapText: "We should ___ these delicious apples.",
    gapWord: "share",
    gapOptions: ["share", "fight", "cold", "throw"]
  },
  {
    id: "m-soc-9",
    level: "intermedio",
    title: "Social: Invitar a Cenar",
    description: "Invita a tu pareja o familia a cenar comida casera los viernes.",
    vocab: ["Invite", "Dinner", "Friday", "Cook"],
    vocabTrans: ["Invitar", "Cena", "Viernes", "Cocinar"],
    phraseEng: "I want to invite you to dinner",
    phraseEsp: "Quiero invitarte a cenar",
    gapText: "What are you going to ___ on Friday?",
    gapWord: "cook",
    gapOptions: ["cook", "sleep", "sing", "fly"]
  },
  {
    id: "m-soc-10",
    level: "intermedio",
    title: "Social: Recuerdos de Infancia",
    description: "Platica sobre tus actividades predilectas de niño.",
    vocab: ["Memories", "Childhood", "Game", "Memory"],
    vocabTrans: ["Recuerdos", "Infancia", "Juego", "Memoria"],
    phraseEng: "I have happy childhood memories playing outdoors",
    phraseEsp: "Tengo felices recuerdos de la infancia jugando al aire libre",
    gapText: "Our first vacation left sweet ___ in my mind.",
    gapWord: "memories",
    gapOptions: ["memories", "pills", "tickets", "gates"]
  }
];

export function getGeneratedModules(): Module[] {
  return MASTER_SPECS.map((spec) => {
    const q1: Question = {
      id: `q-${spec.id}-1`,
      type: "multiple-choice",
      prompt: `¿Qué significa la palabra '${spec.vocab[0]}'?`,
      englishText: spec.vocab[0],
      spanishText: spec.vocabTrans[0],
      options: [
        spec.vocabTrans[0],
        spec.vocabTrans[1] || "Opción B",
        spec.vocabTrans[2] || "Opción C",
        "Ninguna de las anteriores"
      ],
      correctOptionIndex: 0
    };

    const q2: Question = {
      id: `q-${spec.id}-2`,
      type: "fill-gap",
      prompt: `Elige la palabra correcta para completar la oración:`,
      englishText: spec.gapText.replace("___", spec.gapWord),
      spanishText: spec.phraseEsp,
      options: spec.gapOptions,
      gapText: spec.gapText,
      correctGapWord: spec.gapWord
    };

    // Scramble logic: split the english phrase words and scramble them so the student can drag them
    const originalWords = spec.phraseEng.split(" ");
    // Unscrambler options
    const q3Options = [...originalWords].sort(() => 0.5 - Math.random());

    const q3: Question = {
      id: `q-${spec.id}-3`,
      type: "arrange-word",
      prompt: `Ordena las palabras para traducir la frase: '${spec.phraseEsp}'`,
      englishText: spec.phraseEng,
      spanishText: spec.phraseEsp,
      options: q3Options
    };

    const q4: Question = {
      id: `q-${spec.id}-4`,
      type: "translate",
      prompt: `Escribe la traducción en inglés para la frase: '${spec.phraseEsp}'`,
      englishText: spec.phraseEng,
      spanishText: spec.phraseEsp,
      options: []
    };

    return {
      id: spec.id,
      level: spec.level,
      title: spec.title,
      description: spec.description,
      vocabulary: spec.vocab,
      phrases: [
        { english: spec.phraseEng, spanish: spec.phraseEsp },
        { english: spec.gapText.replace("___", spec.gapWord), spanish: spec.phraseEsp }
      ],
      questions: [q1, q2, q3, q4]
    };
  });
}
