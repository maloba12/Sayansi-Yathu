/**
 * Sayansi Yathu Experiment Visual Asset System
 * 
 * Maps scientific experiments to high-quality educational visuals.
 * Categorization logic for Biology, Chemistry, and Physics.
 */

const BASE_URLS = {
  biology: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
  chemistry: 'https://images.unsplash.com/photo-1532187875605-1ef6ec14a1a1?auto=format&fit=crop&q=80&w=800',
  physics: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
  default: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=800'
};

const KEYWORD_MAP = {
  // BIOLOGY
  microscope: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=800',
  cell: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800',
  plant: 'https://images.unsplash.com/photo-1463171339941-c4463ec364b0?auto=format&fit=crop&q=80&w=800',
  leaf: 'https://images.unsplash.com/photo-1501004318641-729e8e2c0192?auto=format&fit=crop&q=80&w=800',
  anatomy: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
  heart: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
  digestion: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
  bacteria: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800',
  eye: 'https://images.unsplash.com/photo-1544256718-3bcf237ca39b?auto=format&fit=crop&q=80&w=800',
  ecosystem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
  soil: 'https://images.unsplash.com/photo-1464226184884-fa280b87c3a9?auto=format&fit=crop&q=80&w=800',
  
  // CHEMISTRY
  titration: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
  beaker: 'https://images.unsplash.com/photo-1532187875605-1ef6ec14a1a1?auto=format&fit=crop&q=80&w=800',
  reaction: 'https://images.unsplash.com/photo-1514992364721-cd0208399587?auto=format&fit=crop&q=80&w=800',
  electrolysis: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
  acid: 'https://images.unsplash.com/photo-1603126727216-b96420cd0454?auto=format&fit=crop&q=80&w=800',
  base: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
  periodic: 'https://images.unsplash.com/photo-1532187875605-1ef6ec14a1a1?auto=format&fit=crop&q=80&w=800',
  metal: 'https://images.unsplash.com/photo-1536681735512-bc786963286b?auto=format&fit=crop&q=80&w=800',
  separation: 'https://images.unsplash.com/photo-1514992364721-cd0208399587?auto=format&fit=crop&q=80&w=800',
  ph: 'https://images.unsplash.com/photo-1576398289164-c48dc021b4a1?auto=format&fit=crop&q=80&w=800',
  
  // PHYSICS
  circuit: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=800',
  magnet: 'https://images.unsplash.com/photo-1628527302488-34bb32a4371b?auto=format&fit=crop&q=80&w=800',
  pendulum: 'https://images.unsplash.com/photo-1590483736622-39da8af7ec8d?auto=format&fit=crop&q=80&w=800',
  light: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
  prism: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
  reflection: 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?auto=format&fit=crop&q=80&w=800',
  multimeter: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
  vernier: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
  transformer: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
  force: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
};

/**
 * Intelligently retrieves a scientific image based on experiment properties.
 */
export const getExperimentImage = (experiment) => {
  if (experiment.image_url && experiment.image_url.startsWith('http')) {
    return experiment.image_url;
  }

  const textToMatch = `${experiment.title} ${experiment.topic} ${experiment.category}`.toLowerCase();
  
  // Try to find a keyword match
  for (const [key, url] of Object.entries(KEYWORD_MAP)) {
    if (textToMatch.includes(key)) return url;
  }

  // Fallback to subject-based defaults
  const subjectKey = experiment.subject?.toLowerCase() || 'default';
  return BASE_URLS[subjectKey] || BASE_URLS.default;
};

export const SUBJECT_COLORS = {
  biology: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    accent: 'bg-emerald-500',
    border: 'border-emerald-100',
    gradient: 'from-emerald-500 to-teal-600'
  },
  physics: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    accent: 'bg-blue-500',
    border: 'border-blue-100',
    gradient: 'from-blue-500 to-indigo-600'
  },
  chemistry: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    accent: 'bg-orange-500',
    border: 'border-orange-100',
    gradient: 'from-orange-500 to-amber-600'
  },
  default: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    accent: 'bg-gray-500',
    border: 'border-gray-100',
    gradient: 'from-gray-500 to-slate-600'
  }
};
