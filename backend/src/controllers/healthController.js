export const health = (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
};