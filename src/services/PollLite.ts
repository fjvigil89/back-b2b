import { getConnection } from "typeorm";
import { PollLiteRepository } from "../repository";
import { uniqBy } from "../utils/service";

export class PollLiteService {
  public async answerPoll(
    client: string,
    aryResponse: [{ id: number; respuesta: string }],
    date: string,
    user: string
  ): Promise<void> {
    await Promise.all(
      aryResponse.map((row) => {
        return getConnection(client)
          .getCustomRepository(PollLiteRepository)
          .answerPoll(row.id, row.respuesta, date, user);
      }),
    );
  }

  public async groupListPoll(
    client: string,
    folio?: number,
    userId?: string,
  ): Promise<any> {
    const ListStore = await getConnection(client)
      .getCustomRepository(PollLiteRepository)
      .listPollUser(userId);

    const dataPoll = await getConnection(client)
    .getCustomRepository(PollLiteRepository) 
    .dataPoll(ListStore, userId)
    return getConnection(client)
      .getCustomRepository(PollLiteRepository)
      .listPoll(folio, userId)
      .then((list) => {
        return uniqBy(list, "folio").map((id) => {
          const storePoll = list.filter((row) => row.folio === id);
          const available = storePoll.filter(e => e.state == 'available').length;
          const visita_en_progreso = dataPoll.find(e => e.folio === id).visita_en_progreso          
          return {
            available: available,
            description: storePoll[0].descripcion,
            bandera: storePoll[0].bandera,
            direccion: storePoll[0].direccion,
            visita_en_progreso,
            latitud: parseFloat(storePoll[0].latitud),
            longitud:parseFloat(storePoll[0].longitud),
            cadena:storePoll[0].cadena,
            folio:storePoll[0].folio,
            listPolls: storePoll.map((poll) => {
              return {
                description: poll.detalle_encuenta,
                idPoll: poll.id_sala_encuesta,
                state: poll.state,
                title: poll.nombre_encuesta,
                
              };
            }),
          };
        });
      });
  }

  public groupDetailPoll(client: string, id: number): Promise<IGroupDetail[]> {
    return getConnection(client)
      .getCustomRepository(PollLiteRepository)
      .findBySalaPoll(id)
      .then((detail) => {
        return detail.map((row, index) => {
          if (row.tipo === "radio") {
            return {
              config: [
                {
                  id: 1,
                  text: "Si",
                },
                {
                  id: 2,
                  text: "No",
                },
              ],
              id: row.id,
              step: ++index,
              title: row.item,
              type: row.tipo,
            };
          } else if (row.tipo === "input") {
            return {
              id: row.id,
              response: row.response,
              step: ++index,
              title: row.item,
              type: row.tipo,
            };
          } else {
            return {
              id: row.id,
              step: ++index,
              title: row.item,
              type: row.tipo,
            };
          }
        });
      });
  }
}
