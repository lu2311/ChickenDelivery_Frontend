const NUMBER_WORDS = {
  un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
};

export const normalizeSaleText = (value = "") => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/coca[\s-]*cola/g, "coca cola")
  .replace(/\bcoke\b/g, "coca cola")
  .replace(/\bmedio\s+(?:de\s+)?pollo\b/g, "1/2 pollo")
  .replace(/\bcuarto\s+(?:de\s+)?pollo\b/g, "1/4 pollo")
  .replace(/[^a-z0-9\s,/]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const singular = (token) => {
  if (token.length > 4 && token.endsWith("es") && /(?:ces|ones|res|les)$/.test(token)) {
    if (token.endsWith("ces")) return `${token.slice(0, -3)}z`;
  }
  if (token.length > 3 && token.endsWith("s")) return token.slice(0, -1);
  return token;
};

const meaningfulTokens = (value) => normalizeSaleText(value)
  .split(/\s+/)
  .map(singular)
  .filter((token) => token && !["de", "del", "el", "la", "los", "las", "por", "ec", "etc", "etcetera"].includes(token));

const quantityValue = (value) => Number(value) || NUMBER_WORDS[value] || 1;

function candidatesFor(description, products) {
  const productOnlyDescription = description.split(/\b(?:delivery|recojo|efectivo|yape|tarjeta|presencial|whatsapp|telefono|direccion)\b/)[0];
  const wanted = meaningfulTokens(productOnlyDescription);
  if (!wanted.length) return [];

  return products.map((product) => {
    const productTokens = meaningfulTokens(product.nombre);
    const exact = wanted.join(" ") === productTokens.join(" ");
    const includesWanted = wanted.every((token) => productTokens.includes(token));
    const wantedIncludesProduct = productTokens.every((token) => wanted.includes(token));
    let score = exact ? 300 : 0;
    if (includesWanted) score = Math.max(score, 180 - (productTokens.length - wanted.length) * 5);
    if (wantedIncludesProduct) score = Math.max(score, 160 - (wanted.length - productTokens.length) * 5);
    return { product, score, wanted, productTokens };
  }).filter((candidate) => candidate.score > 0).sort((a, b) => b.score - a.score);
}

export function parseCatalogItems(text, products) {
  const normalized = normalizeSaleText(text);
  const quantityPattern = "(?:\\d+|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)";
  const expression = new RegExp(`(?:^|,\\s*|\\s+(?:y|con)\\s+)(${quantityPattern})\\s+(.+?)(?=\\s+(?:y|con)\\s+${quantityPattern}\\s+|,|$)`, "g");
  const mentions = [];
  let match;
  while ((match = expression.exec(normalized)) !== null) {
    mentions.push({ quantity: quantityValue(match[1]), description: match[2].trim() });
  }

  // También acepta un producto sin cantidad cuando se menciona por su nombre completo.
  if (!mentions.length) {
    const exactProduct = products.find((product) => normalized.includes(normalizeSaleText(product.nombre)));
    if (exactProduct) mentions.push({ quantity: 1, description: exactProduct.nombre });
  }

  const items = [];
  const unresolved = [];
  mentions.forEach((mention) => {
    const candidates = candidatesFor(mention.description, products);
    if (!candidates.length) {
      unresolved.push({ ...mention, options: [] });
      return;
    }

    const best = candidates[0];
    if (best.wanted.join(" ") === "pollo") {
      const familiar = candidates.find((candidate) => normalizeSaleText(candidate.product.nombre).includes("pollo familiar"));
      if (familiar) {
        items.push({ ...familiar.product, cantidad: mention.quantity });
        return;
      }
    }
    const similarlyNamed = candidates.filter((candidate) => candidate.score === best.score);
    const oneWordAmbiguous = best.wanted.length === 1 && candidates.length > 1 && best.score < 300;
    if (similarlyNamed.length > 1 || oneWordAmbiguous) {
      unresolved.push({
        ...mention,
        options: candidates.slice(0, 5).map((candidate) => candidate.product),
      });
      return;
    }
    items.push({ ...best.product, cantidad: mention.quantity });
  });

  return { items, unresolved };
}

export function mergeSaleItems(current, additions) {
  return additions.reduce((result, addition) => {
    const itemKey = (item) => `${item.tipo || "producto"}-${item.id}`;
    const existing = result.find((item) => itemKey(item) === itemKey(addition));
    return existing
      ? result.map((item) => itemKey(item) === itemKey(addition) ? { ...item, cantidad: item.cantidad + addition.cantidad } : item)
      : [...result, addition];
  }, [...current]);
}
