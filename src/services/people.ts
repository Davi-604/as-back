import { PrismaClient, Prisma } from '@prisma/client';
import * as eventService from '../services/event';
import * as groupService from '../services/group';

const prisma = new PrismaClient();

type RequestFilters = { id_event: number; id_group?: number };
type GetOneRequestFilters = {
    id_event: number;
    id_group?: number;
    id?: number;
    cpf?: string;
};

export const getAll = async (filters: RequestFilters) => {
    const event = await eventService.getOne(filters.id_event);
    if (!event) return;

    return await prisma.eventPeople.findMany({ where: filters });
};

export const getOne = async (filters: GetOneRequestFilters) => {
    const event = await eventService.getOne(filters.id_event);
    if (!event) return;

    return await prisma.eventPeople.findFirst({ where: filters });
};

type PeopleCreateData = Prisma.Args<typeof prisma.eventPeople, 'create'>['data'];
export const add = async (data: PeopleCreateData) => {
    try {
        if (!data.id_group) return;

        const group = await groupService.getOne({
            id: data.id_group,
            id_event: data.id_event,
        });
        if (!group) return;

        return await prisma.eventPeople.create({ data });
    } catch (err) {
        return false;
    }
};

type PeopleUpdateData = Prisma.Args<typeof prisma.eventPeople, 'update'>['data'];
export const update = async (filters: GetOneRequestFilters, data: PeopleUpdateData) => {
    try {
        return await prisma.eventPeople.updateMany({ where: filters, data });
    } catch (err) {
        return false;
    }
};

type DeletePerson = {
    id_event?: number;
    id_group?: number;
    id: number;
};
export const remove = async (filters: DeletePerson) => {
    try {
        return await prisma.eventPeople.delete({ where: filters });
    } catch (err) {
        return false;
    }
};
