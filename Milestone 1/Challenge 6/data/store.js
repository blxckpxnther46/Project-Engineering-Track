let confessions = [];
let currentId = 0;

function getNextId() {
  return ++currentId;
}

module.exports = {
  confessions,
  getNextId
};
