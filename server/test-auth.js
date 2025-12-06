const axios = require('axios');

async function testAuth() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Attempting to register user: ${email}`);

    try {
        // 1. Register
        const regRes = await axios.post('http://localhost:3000/api/auth/register', {
            email,
            password
        });
        console.log('Registration Success:', regRes.data);

        // 2. Login
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email,
            password
        });
        console.log('Login Success:', loginRes.data);

    } catch (error) {
        console.error('Auth Test Failed:', error.response ? error.response.data : error.message);
    }
}

testAuth();
