const { confessions, getNextId } = require('../data/store');

const categories = ["bug", "deadline", "imposter", "vibe-code"];
const DELETE_TOKEN = process.env.DELETE_TOKEN;

exports.createConfession = (data) => {
  if (!data || !data.text) throw new Error('Text required');
  if (data.text.length === 0) throw new Error('Text too short');
  if (data.text.length > 500) throw new Error('Text too long');
  if (!categories.includes(data.category)) throw new Error('Invalid category');

  const confession = {
    id: getNextId(),
    text: data.text,
    category: data.category,
    created_at: new Date()
  };

  confessions.push(confession);
  return confession;
};

exports.getAllConfessions = () => {
  const sorted = [...confessions].sort((a, b) => b.created_at - a.created_at);
  return { data: sorted, count: sorted.length };
};

exports.getConfessionById = (id) => {
  return confessions.find(c => c.id === parseInt(id));
};

exports.getByCategory = (cat) => {
  if (!categories.includes(cat)) throw new Error('Invalid category');

  return confessions.filter(c => c.category === cat).reverse();
};

exports.deleteConfession = (id, token) => {
  if (token !== DELETE_TOKEN) throw new Error('Unauthorized');

  const index = confessions.findIndex(c => c.id === parseInt(id));
  if (index === -1) throw new Error('Not found');

  const deleted = confessions.splice(index, 1);
  return { msg: 'ok', item: deleted[0] };
};
