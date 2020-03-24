const db = require('../database/connections');

module.exports = {
    async index(request, response) {

        const ong_id = request.headers.authorization;

        try {
            const incidents = await db('incidents')
                .select('*')
                .where('ong_id', ong_id);
        
            return response.json(incidents);
        }
        catch(e) {
            console.error(e);
            return response.status(500).send("Something Wrong Happened!");
        }
        
    },
}