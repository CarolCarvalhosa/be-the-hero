const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        //paginação inicio
        const { page = 1 } = request.query;

        //colchetes retorna primeiro resultado do array, ex: count[0]
        const [count] = await connection('incidents').count();
        console.log(count);

        const incidents = await connection('incidents')
          .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
          //paginação continuação
          .limit(5)
          .offset((page - 1) * 5)
          .select([
              'incidents.*',
              'ongs.name',
              'ongs.email',
              'ongs.whatsapp',
              'ongs.city',
              'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;
        const incident = await connection('incidents')
          .where('id', id)
          .select('ong_id')
          .first();
        if(incident.ong_id != ong_id) {
            //retornar status nao autorizado (http status codes)
            return response.status(401).json({ error: 'Operation not permitted.' });
        }
        await connection('incidents').where('id', id).delete();
        //resposta sem conteúdo
        return response.status(204).send();
    }
}