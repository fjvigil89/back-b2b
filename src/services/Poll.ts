import { getConnection } from "typeorm";
import { PollRepository } from "../repository";
import { uniqBy } from "../utils/service";

interface IGroupDetail {
    id: number;
    step: number;
    title: string;
    type: string;
    config?: Array<{
        id: number,
        text: string,
    }>;
}

interface IGroupList {
    description: string;
    available: number;
    listPolls: Array<{
        description: string,
        idPoll: number,
        state: string,
        title: string,
    }>;
}

export class PollService {

    public async answerPoll(client: string, aryResponse: [{ id: number, respuesta: string }]): Promise<void> {
        await Promise.all(aryResponse.map((row) => {
            return getConnection(client).getCustomRepository(PollRepository).answerPoll(row.id, row.respuesta);
        }));
    }

    public groupListPoll(client: string, folio?: number): Promise<IGroupList[]> {
        return getConnection(client).getCustomRepository(PollRepository).listPoll(folio)
            .then((list) => {
                return uniqBy(list, "folio").map((id) => {
                    const storePoll = list.filter((row) => row.folio === id);
                    return {
                        available: storePoll.length,
                        description: storePoll[0].descripcion,
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
        return getConnection(client).getCustomRepository(PollRepository).findBySalaPoll(id)
            .then((detail) => {
                return detail.map((row, index) => {
                    if (row.tipo === "radio") {
                        return {
                            config: [{
                                id: 1,
                                text: "Si",
                            }, {
                                id: 2,
                                text: "No",
                            }],
                            id: row.id,
                            step: ++index,
                            title: row.item,
                            type: row.tipo,
                        };
                    } else if (row.tipo === "input") {
                        return { id: row.id, response: row.response, step: ++index, title: row.item, type: row.tipo };
                    } else {
                        return { id: row.id, step: ++index, title: row.item, type: row.tipo };
                    }
                });
            });
    }

}
