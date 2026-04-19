const express = require('express');
const router = express.Router();
const db = require('../db');


// 🔐 RBAC Filter Function
function filterUserData(user, role) {
  if (role === "Admin") return user;

  if (role === "Manager") {
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email
    };
  }

  if (role === "User") {
    return {
      user_id: user.user_id,
      name: user.name
    };
  }
}


// 📌 GET all users (with tenant isolation + RBAC)
router.get('/', async (req, res) => {
  try {
    const role = req.query.role || "User";         // simulate logged-in role
    const tenantId = req.query.tenant_id || 1;     // simulate tenant

    const { rows } = await db.query(
      'SELECT * FROM users WHERE tenant_id = $1',
      [tenantId]
    );

    const filtered = rows.map(user =>
      filterUserData(user, role)
    );

    res.json(filtered);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});


// 📌 GET single user (secure + tenant-safe)
router.get('/:id', async (req, res) => {
  try {
    const role = req.query.role || "User";
    const tenantId = req.query.tenant_id || 1;
    const { id } = req.params;

    const { rows } = await db.query(
      'SELECT * FROM users WHERE user_id = $1 AND tenant_id = $2',
      [id, tenantId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found or access denied.' });
    }

    const filtered = filterUserData(rows[0], role);

    res.json(filtered);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to find user.' });
  }
});


module.exports = router;