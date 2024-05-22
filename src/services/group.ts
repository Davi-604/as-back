import { PrismaClient, Prisma } from '@prisma/client';
import * as eventService from '../services/event';

const prisma = new PrismaClient();

type RequestFilters = { id: number; id_event: number };

export const getAll = async (id_event: number) => {
    try {
        return await prisma.eventGroup.findMany({ where: { id_event } });
    } catch (err) {
        return false;
    }
};

export const getOne = async (filters: RequestFilters) => {
    try {
        return await prisma.eventGroup.findFirst({ where: filters });
    } catch (err) {
        return false;
    }
};

type GroupsCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data'];
export const add = async (data: GroupsCreateData) => {
    try {
        if (!data.id_event) return;

        const event = await eventService.getOne(data.id_event);
        if (!event) return;

        return await prisma.eventGroup.create({ data });
    } catch (err) {
        return false;
    }
};

type GroupsUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data'];
export const update = async (filters: RequestFilters, data: GroupsUpdateData) => {
    try {
        const event = await eventService.getOne(filters.id_event);
        if (!event) return;

        return await prisma.eventGroup.update({ where: filters, data });
    } catch (err) {
        return false;
    }
};

export const remove = async (filters: RequestFilters) => {
    try {
        return await prisma.eventGroup.delete({ where: filters });
    } catch (err) {
        return false;
    }
};
