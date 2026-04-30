const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: true,
        rejectUnauthorized: false, 
        reconnectStrategy: (retries) => {
            if (retries > 10) return new Error('Redis reconnection failed');
            return Math.min(retries * 100, 3000); 
        }
    }
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

(async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('✅ Redis connected successfully');
        }
    } catch (err) {
        console.error('❌ Could not connect to Redis:', err);
    }
})();

module.exports = client;