import { PrismaClient, Prisma } from '@prisma/client';
import * as groupService from '../services/group';
import * as peopleService from '../services/people';
import { encryptMatch } from '../utils/matches';

const prisma = new PrismaClient();

export const getAll = async () => {
    try {
        return await prisma.event.findMany();
    } catch (err) {
        return false;
    }
};

export const getOne = async (id: number) => {
    try {
        return await prisma.event.findFirst({ where: { id } });
    } catch (err) {
        return false;
    }
};

type EventsCreateData = Prisma.Args<typeof prisma.event, 'create'>['data'];
export const add = async (data: EventsCreateData) => {
    try {
        return await prisma.event.create({ data });
    } catch (err) {
        return false;
    }
};

type EventsUpdateData = Prisma.Args<typeof prisma.event, 'update'>['data'];
export const update = async (id: number, data: EventsUpdateData) => {
    try {
        return await prisma.event.update({ where: { id }, data });
    } catch (err) {
        return false;
    }
};

export const remove = async (id: number) => {
    try {
        return await prisma.event.delete({ where: { id } });
    } catch (err) {
        return false;
    }
};

export const DoMatches = async (id: number) => {
    const event = await getOne(id);
    if (event) {
        const peopleList = await peopleService.getAll({ id_event: id });
        if (peopleList) {
            let sortedList: { id: number; matched: number }[] = [];
            let sortable: number[] = [];

            let attempts = 0;
            let maxAttemps = peopleList.length;
            let keepTrying = true;

            while (keepTrying && attempts < maxAttemps) {
                keepTrying = false;
                attempts++;
                sortedList = [];
                sortable = peopleList.map((person) => person.id);

                for (let i in peopleList) {
                    let sortableFiltered = sortable;
                    if (event.grouped) {
                        sortableFiltered.filter((sortableItem) => {
                            let sortablePerson = peopleList.find(
                                (item) => item.id === sortableItem
                            );
                            return peopleList[i].id_group !== sortablePerson?.id_group;
                        });
                    }

                    if (
                        sortableFiltered.length === 0 ||
                        (sortableFiltered.length === 1 &&
                            sortableFiltered[0] === peopleList[i].id)
                    ) {
                        keepTrying = true;
                    } else {
                        let sortedIndex = Math.floor(
                            Math.random() * sortableFiltered.length
                        );
                        while (sortableFiltered[sortedIndex] === peopleList[i].id) {
                            sortedIndex = Math.floor(
                                Math.random() * sortableFiltered.length
                            );
                        }

                        sortedList.push({
                            id: peopleList[i].id,
                            matched: sortableFiltered[sortedIndex],
                        });
                        sortable = sortable.filter(
                            (item) => item !== sortableFiltered[sortedIndex]
                        );
                    }
                }
            }

            if (attempts < maxAttemps) {
                for (let i in sortedList) {
                    await peopleService.update(
                        { id_event: id, id: sortedList[i].id },
                        { matched: encryptMatch(sortedList[i].matched) }
                    );
                }
                return true;
            }
        }
    }

    return false;
};
