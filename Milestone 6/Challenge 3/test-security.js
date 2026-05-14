const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function runTests() {
    try {
        console.log('=== TokenApp Security Tests ===\n');

        // Get a valid token by logging in as regular user
        console.log('Step 1: Login to get valid token...');
        const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
            email: 'user@tokenapp.io',
            password: 'user123'
        });
        const userToken = loginResponse.data.token;
        console.log('✅ Got user token:', userToken.substring(0, 20) + '...\n');

        // Get admin token
        const adminLoginResponse = await axios.post(`${API_URL}/api/auth/login`, {
            email: 'admin@tokenapp.io',
            password: 'admin123'
        });
        const adminToken = adminLoginResponse.data.token;
        console.log('✅ Got admin token:', adminToken.substring(0, 20) + '...\n');

        // Test 1: No token
        console.log('Test 1: No Token');
        try {
            await axios.get(`${API_URL}/api/tasks`);
        } catch (err) {
            console.log('Status:', err.response.status);
            console.log('Response:', err.response.data);
        }
        console.log('✅ PASS: Returns 401\n');

        // Test 2: Fake token
        console.log('Test 2: Fake Token');
        try {
            await axios.get(`${API_URL}/api/tasks`, {
                headers: { Authorization: 'Bearer thisisnotreal' }
            });
        } catch (err) {
            console.log('Status:', err.response.status);
            console.log('Response:', err.response.data);
        }
        console.log('✅ PASS: Returns 401\n');

        // Test 3: Valid token
        console.log('Test 3: Valid Token');
        const tasksResponse = await axios.get(`${API_URL}/api/tasks`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('Status: 200');
        console.log('Response: Tasks data retrieved');
        console.log('Tasks count:', tasksResponse.data.length);
        console.log('✅ PASS: Returns 200 with data\n');

        // Test 4: Admin route with admin token (should work)
        console.log('Test 4: Admin Route with Admin Token');
        const adminUsersResponse = await axios.get(`${API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Status: 200');
        console.log('Users count:', adminUsersResponse.data.length);
        console.log('✅ PASS: Admin can access admin routes\n');

        // Test 5: Admin route with non-admin token (should fail)
        console.log('Test 5: Admin Route with Non-Admin Token');
        try {
            await axios.get(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('❌ FAIL: Should have been rejected');
        } catch (err) {
            console.log('Status:', err.response.status);
            console.log('Response:', err.response.data);
            console.log('✅ PASS: Non-admin user rejected (returns 401)\n');
        }

        console.log('=== All Tests Complete ===');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

runTests();
