const db = require('../database/connections');

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        try {
            const ong = await db('ongs')
            .where('id', id)
            .select('name')
            .first();

        if(!ong) {
            return response
                .status(400)
                .json({
                    error: "No ONG found with this ID"
                })
        }
        
            return response.json(ong);
        }
        catch(e) {
            console.error(e);
            return response.status(500).send("Something Wrong Happened!");
        }
    }
}