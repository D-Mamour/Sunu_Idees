const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;


export async function cleanCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  // Vérification locale rapide
  if (text.includes("pédagog") || text.includes("pedagog")) {
    return "Pédagogie";
  }

  if (text.includes("événement") || text.includes("evenement")) {
    return "Événement";
  }

  if (text.includes("campus")) {
    return "Vie de campus";
  }

  if (text.includes("technique")) {
    return "Amélioration technique";
  }

  // Prompt IA
  const prompt = `
Tu es un validateur.

Catégories possibles :

- Pédagogie
- Événement
- Vie de campus
- Amélioration technique

Titre :
${title}

Description :
${description}

Si le texte est incohérent, incompréhensible ou aléatoire,
réponds uniquement :

INVALIDE

Sinon réponds uniquement par le nom exact
de la catégorie.
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-ultra-550b-a55b:free",
          messages: [
            {
              role: "system",
              content: prompt,
            },
          ],
          temperature: 0,
          stream: false,
        }),
      }
    );

    console.log("Réponse brute :", response);

    if (!response.ok) {
      throw new Error(
        `Erreur OpenRouter : ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Réponse IA :", data);

    const answer =
      data?.choices?.[0]?.message?.content?.trim() || "";

    // Nettoyage de la réponse IA
    const result = answer.toLowerCase();

    if (result.includes("pédagog") || result.includes("pedagog")) {
      return "Pédagogie";
    }

    if (result.includes("événement") || result.includes("evenement")) {
      return "Événement";
    }

    if (result.includes("campus")) {
      return "Vie de campus";
    }

    if (
      result.includes("technique") ||
      result.includes("amélioration technique")
    ) {
      return "Amélioration technique";
    }

    // Sécurité si l'IA répond autre chose
    return "Vie de campus";
  } catch (error) {
    console.error("Erreur IA :", error);

    return "Vie de campus";
  }
}