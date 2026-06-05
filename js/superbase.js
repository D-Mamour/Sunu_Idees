const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function addIdea(idea) {
  const { error } = await supabaseClient.from("idees").insert([idea]);

  if (error) {
    throw error;
  }
}

async function getIdeas() {
  const { data, error } = await supabaseClient
    .from("idees")
    .select("*")
    .order("date_creation", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

async function updateIdea(id, titre, description) {
  const { error } = await supabaseClient
    .from("idees")
    .update({
      titre,
      description,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

async function deleteIdea(id) {
  const { error } = await supabaseClient.from("idees").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
