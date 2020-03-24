const db = require('../database/connections');

module.exports = {
    async index(request, response) {

        const pageSize = 5;

        const {page = 1} = request.query;

        try {

            const [count] = await db('incidents').count();

            const incidents = await db('incidents')
                .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
                .select([
                    'incidents.*',
                    'ongs.name',
                    'ongs.email',
                    'ongs.whatsapp',
                    'ongs.city',
                    'ongs.uf'
                ])
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            response.header('X-Total-Count', count['count(*)'])
        
            return response.json(incidents);
        }
        catch(e) {
            console.error(e);
            return response.status(500).send("Something Wrong Happened!");
        }
        
    },
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        try {
            const [id] = await db('incidents').insert({
                title,
                description,
                value,
                ong_id
            });

            return response.json({ id });
        }
        catch(e) {
            console.error(e);
            return response.status(500).send("Something Wrong Happened!");
        }
    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;
        
        const incident = await db('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if(incident.ong_id !== ong_id) {
            return response.status(401).json({error: 'Operation denied.'});
        }

        await db('incidents')
            .where('id', id)
            .delete();

        return response.status(204).send();
    }
}