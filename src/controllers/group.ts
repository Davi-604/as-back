import { RequestHandler } from 'express';
import * as groupService from '../services/group';
import { string, z } from 'zod';

export const getAll: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const groups = await groupService.getAll(parseInt(id_event));
    if (!groups) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    return res.status(200).json({ groups });
};

export const getOne: RequestHandler = async (req, res) => {
    const { id_event, id } = req.params;

    const group = await groupService.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event),
    });
    if (!group) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    return res.status(200).json({ group });
};

export const add: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const groupSchema = z.object({
        name: string(),
    });
    const body = groupSchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).json({ error: 'Dados inválidos/incorretos' });
    }

    const newGroup = await groupService.add({
        id_event: parseInt(id_event),
        name: body.data.name,
    });
    if (!newGroup) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    return res.status(200).json({ newGroup });
};

export const update: RequestHandler = async (req, res) => {
    const { id_event, id } = req.params;

    const groupSchema = z.object({
        name: string().optional(),
    });
    const body = groupSchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).json({ error: 'Dados inválidos/incorretos' });
    }

    const group = await groupService.update(
        {
            id: parseInt(id),
            id_event: parseInt(id_event),
        },
        body.data
    );
    if (!group) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    return res.status(200).json({ group });
};

export const remove: RequestHandler = async (req, res) => {
    const { id_event, id } = req.params;

    const deletedGroup = await groupService.remove({
        id: parseInt(id),
        id_event: parseInt(id_event),
    });
    if (!deletedGroup) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    return res.status(200).json({ deletedGroup: deletedGroup.id });
};
