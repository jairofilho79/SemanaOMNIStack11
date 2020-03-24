const db = require('../database/connections');
const crypto = require('crypto');

module.exports = {
    async index(request, response) {

        try {
            const ongs = await db('ongs').select('*');
        
            return response.json(ongs);
        }
        catch(e) {
            console.error(e);
            return response.status(500).send("Something Wrong Happened!");
        }
        
    },
    async create(request, response) {
        const {name, email, whatsapp, city, uf} = request.body;
    
        const id = crypto.randomBytes(4).toString('HEX');
    
        try {
            await db('ongs').insert({
                id,
                name,
                email,
                whatsapp,
                city,
                uf
            })
        
            return response.json({ id });
        }
        catch(e) {
            console.error(e);
            return response.status(500).send("Something Wrong Happened!");
        }
    }
}