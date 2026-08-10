// Placeholder review content for the product reviews section.
//
// IMPORTANT: these 127 reviews are entirely invented placeholder content —
// no "Verified Customer" claim is attached anywhere on purpose, because
// none of these are real purchases. Swap this whole module for a real
// reviews app (Judge.me, Loox, Shopify Product Reviews, etc.) before this
// goes live so the count/rating/text shown are genuine. The average rating
// and total shown in the UI are computed live from this array — nothing is
// a separately-fabricated statistic.
//
// Content is built from hand-written phrase banks combined deterministically
// (seeded PRNG, no re-shuffling on every page load) so every review reads
// as a distinct voice/length instead of a single template repeated.

const FIRST_NAMES = [
  'Marisol', 'Elena', 'Noelia', 'Carmen', 'Paula', 'Yolanda', 'Cristina',
  'Beatriz', 'Silvia', 'Irene', 'Alba', 'Marta', 'Raquel', 'Nerea',
  'Patricia', 'Verónica', 'Gloria', 'Esther', 'Inés', 'Mónica', 'Teresa',
  'Laura', 'Ángela', 'Sara', 'Eva', 'Rosa', 'Pilar', 'Diana', 'Susana',
  'Cecilia', 'Alicia', 'Nuria', 'Amparo', 'Belén', 'Celia', 'Dolores',
  'Fátima', 'Gema', 'Isabel', 'Julia', 'Lorena', 'Mercedes', 'Natalia',
  'Olga', 'Rocío', 'Sandra', 'Tamara', 'Vanesa', 'Ana', 'Claudia',
  'Débora', 'Eugenia', 'Flor', 'Georgina', 'Helena',
];

const LAST_INITIALS = 'ABCDEFGHIJKLMNÑOPQRSTUVXYZ'.split('');

const TITLES = [
  'Se nota la diferencia', 'Cumple lo que promete', 'Mejor de lo que esperaba',
  'Ya es parte de mi rutina', '100% recomendable', 'Por fin algo que funciona',
  'Fácil de tomar', 'Un acierto', 'No me arrepiento', 'Vale la pena',
  'Recomendado por mi ginecóloga', 'Cambio real', 'Sorprendida gratamente',
  'Repito compra', 'Envío rápido y buen producto', 'Lo recomiendo a todas',
  'Funciona de verdad', 'Discreto y efectivo', 'Buena relación calidad-precio',
  'Un descubrimiento', 'Ya voy por el segundo pote', 'Constancia y resultados',
  'Ideal para el día a día', 'Se lo dije a mis amigas', 'Contenta con la compra',
  'Ayuda de verdad', 'Cumple sin exagerar', 'Buena experiencia',
  'Lo recomendó mi hermana', 'Ya no dudo en pedirlo', 'Un antes y un después',
  'Pequeño gran cambio', 'Sin sabor raro, se agradece', 'Constante y efectivo',
  'Mi rutina diaria', 'Gratamente sorprendida', 'Al fin resultados',
  'Fácil y práctico', 'Buen acompañante diario', 'Recomendado',
  'Tardó pero funcionó', 'Aceptable, con matices', 'Podría mejorar el envío',
  'Necesita algo más de tiempo', 'Resultado moderado', 'Notable mejora',
];

// [opener, detail, closer] banks, grouped by the star rating they're
// written to sound like. Sentiment always matches the number of stars.
const BANKS = {
  5: {
    openers: [
      'La verdad, no esperaba mucho, pero me sorprendió gratamente.',
      'Ya voy por el segundo pote y no pienso dejar de tomarlo.',
      'Me lo recomendó una amiga y ahora se lo recomiendo yo a todo el mundo.',
      'Después de probar mil cosas, este es el único que realmente noté.',
      'Fácil de tomar, sin sabor raro, y cumple lo que promete.',
      'Empecé a tomarlo hace un mes y el cambio se nota.',
      'Lo pedí sin muchas expectativas y terminé sorprendida.',
      'Mi ginecóloga me lo recomendó y le hice caso.',
      'Llevo tres meses y es la primera vez que un producto así me funciona de verdad.',
      'No soy de dejar reseñas, pero este producto se lo merece.',
      'Compacto, discreto y funciona, ¿qué más se puede pedir?',
      'Se lo compré a mi madre y ahora lo pide todos los meses.',
      'Al principio dudé por el precio, pero vale cada euro.',
      'Envío rápido y el producto cumple, no tengo quejas.',
    ],
    details: [
      'Noté la diferencia en la primera semana.',
      'Ya no me preocupo tanto por las molestias de antes.',
      'Las cápsulas son pequeñas y no dejan mal sabor.',
      'Lo tomo todas las mañanas con el desayuno y ya es parte de mi rutina.',
      'Se agota rápido en casa, ya voy por el tercer pedido.',
      'Mi pareja también notó el cambio, así que no es solo idea mía.',
      'El envío llegó antes de lo esperado, bien embalado.',
      'Después de un mes tomándolo, siento que por fin encontré algo que funciona.',
      'No sentí ningún efecto raro, solo cosas buenas.',
      'Es fácil de incorporar al día a día, no interrumpe nada.',
      'Mi hermana lo empezó a tomar por mi recomendación y también está encantada.',
      'Al principio pensé que no iba a notar nada, pero a las tres semanas cambió todo.',
      'Las molestias que tenía desde hacía tiempo casi desaparecieron.',
      'Vino bien empaquetado y con instrucciones claras.',
      'Ya lo recomendé en el grupo de amigas del gimnasio.',
      'Es de esos productos que cuesta creer hasta que lo pruebas.',
    ],
    closers: [
      '100% recomendable.',
      'Ya no compro otra cosa.',
      'Vale la pena cada céntimo.',
      'Lo voy a seguir pidiendo seguro.',
      'Si estás dudando, no lo dudes más.',
      'Cumple lo que promete, sin exagerar.',
      'Un acierto total.',
      'Mejor de lo que esperaba, sinceramente.',
      'Ya es parte fija de mi rutina.',
      'Se lo recomendé a mis amigas y todas contentas.',
      'No puedo quejarme de nada.',
      'Repito compra sin dudarlo.',
    ],
  },
  4: {
    openers: [
      'Me costó un poco acostumbrarme las primeras semanas, pero después empecé a notar resultados.',
      'No es magia instantánea, hay que ser constante, pero funciona.',
      'Tardó un poco más de lo que pensaba en notarse, pero al final valió la pena.',
      'El producto está bien, aunque el envío tardó más de lo esperado.',
      'Buen producto, aunque las cápsulas son un poco grandes para mi gusto.',
      'Cumple, aunque esperaba resultados un poco más rápido.',
      'Contenta con el resultado, le resto una estrella por el precio.',
      'Funciona bien, aunque escribí a soporte por una duda y tardaron en responder.',
    ],
    details: [
      'Con constancia se nota, pero no es algo de un día para otro.',
      'El sabor es neutro, eso se agradece.',
      'La caja llegó algo golpeada, aunque el producto en sí estaba bien.',
      'Lo combino con otros cuidados y en conjunto va bien.',
      'Después de un mes y medio empecé a notar la diferencia.',
      'No noté efectos raros, solo tardó un poco en hacer efecto.',
      'El precio es algo elevado, pero el resultado lo compensa.',
      'La atención al cliente fue amable cuando escribí con una duda.',
    ],
    closers: [
      'Aun así lo recomiendo.',
      'Volvería a comprarlo.',
      'Con paciencia, funciona.',
      'Cumple su función.',
      'No está mal para el precio.',
      'En general, contenta con la compra.',
    ],
  },
  3: {
    openers: [
      'No es un milagro, pero sí ayuda un poco.',
      'Cumple a medias, en mi caso no noté un cambio tan grande como esperaba.',
      'El producto en sí está bien, pero el envío llegó dañado y tuve que reclamar.',
      'Ni fu ni fa, sigo probando a ver si con más tiempo noto más diferencia.',
      'Esperaba más para el precio que tiene.',
    ],
    details: [
      'Llevo un mes y la mejora es leve, quizás necesite más tiempo.',
      'El servicio de atención al cliente tardó en responder mi consulta.',
      'Las cápsulas son fáciles de tomar, eso sí lo destaco.',
      'No sé si es el producto o que en mi caso necesito algo más.',
      'El empaque llegó bien, pero el resultado tardó en notarse.',
    ],
    closers: [
      'Voy a darle un poco más de tiempo antes de decidir si repito.',
      'No lo descarto, pero de momento me quedo con dudas.',
      'Puede que funcione mejor en otros casos que en el mío.',
      'Aceptable, sin más.',
    ],
  },
};

// Distribution across 127 reviews — mostly enthusiastic with a realistic
// tail of more measured ones, no 1-2 star reviews included.
const RATING_COUNTS = {5: 97, 4: 22, 3: 8};

// Small seeded PRNG (mulberry32) so the generated set is stable across
// server restarts/deploys instead of reshuffling every time.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260809);

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function buildReviews() {
  const reviews = [];
  const usedCombos = new Set();
  const usedNames = new Set();
  let id = 1;

  // Spread dates across the last ~6 months, most-recent-first once sorted.
  const today = new Date('2026-08-09T12:00:00Z');
  const daysBack = 190;

  for (const [ratingStr, count] of Object.entries(RATING_COUNTS)) {
    const rating = Number(ratingStr);
    const bank = BANKS[rating];

    for (let i = 0; i < count; i++) {
      let opener, detail, closer, comboKey;
      do {
        opener = pick(rand, bank.openers);
        detail = pick(rand, bank.details);
        closer = rand() > 0.15 ? pick(rand, bank.closers) : null;
        comboKey = `${rating}:${opener}|${detail}|${closer}`;
      } while (usedCombos.has(comboKey));
      usedCombos.add(comboKey);

      let name;
      do {
        name = `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_INITIALS)}.`;
      } while (usedNames.has(name));
      usedNames.add(name);

      const daysAgo = Math.floor(rand() * daysBack);
      const date = new Date(today.getTime() - daysAgo * 86400000);

      reviews.push({
        id: id++,
        name,
        rating,
        date: date.toISOString().slice(0, 10),
        title: pick(rand, TITLES),
        body: closer ? `${opener} ${detail} ${closer}` : `${opener} ${detail}`,
      });
    }
  }

  // Most recent first, matching how review widgets default-sort.
  reviews.sort((a, b) => (a.date < b.date ? 1 : -1));
  return reviews;
}

export const REVIEWS = buildReviews();

export function getReviewStats(reviews = REVIEWS) {
  const total = reviews.length;
  const counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
  let sum = 0;
  for (const r of reviews) {
    counts[r.rating] = (counts[r.rating] || 0) + 1;
    sum += r.rating;
  }
  const average = total ? sum / total : 0;
  return {total, counts, average};
}
