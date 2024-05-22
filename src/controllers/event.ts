import { RequestHandler } from 'express';
import * as eventService from '../services/event';
import * as peopleService from '../services/people';
import { z } from 'zod';
import { booleanConverter } from '../utils/booleanConverter';
import { desencryptMatch } from '../utils/matches';

export const getAll: RequestHandler = async (req, res) => {
    const events = await eventService.getAll();
    switch (events) {
        case []:
            return res.status(404).json({
                error: 'Não encontramos eventos disponíveis...',
            });
        case false:
            return res.status(500).json({ error: 'Ocorreu um erro...' });
    }
};

export const getOne: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const event = await eventService.getOne(parseInt(id));
    switch (event) {
        case null:
            return res.status(404).json({ error: 'Não encontramos esse evento...' });
        case false:
            return res.status(500).json({ error: 'Ocorreu um erro...' });
    }
    res.json({ event });
};

export const add: RequestHandler = async (req, res) => {
    req.body.grouped = booleanConverter(req.body.grouped);

    const eventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean(),
    });
    const body = eventSchema.safeParse(req.body);

    if (!body.success) {
        return res.json({ error: 'Informações incorretas/incompletas' });
    }

    const newEvent = await eventService.add(body.data);
    if (newEvent) {
        return res.status(201).json({ event: newEvent });
    } else {
        res.status(500).json({ error: 'Ocorreu um erro...' });
    }
};

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params;

    req.body.grouped = booleanConverter(req.body.grouped);
    req.body.status = booleanConverter(req.body.status);

    const eventSchema = z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.boolean().optional(),
        grouped: z.boolean().optional(),
    });
    const body = eventSchema.safeParse(req.body);
    if (!body.success) {
        return res.json({ error: 'Informações incorretas/incompletas' });
    }

    const updatedEvent = await eventService.update(parseInt(id), body.data);

    if (!updatedEvent) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    if (updatedEvent.status) {
        const matches = await eventService.DoMatches(parseInt(id));
        if (!matches) {
            return res.status(500).json({ error: 'Grupos impossíveis de sortear' });
        }
    } else {
        await peopleService.update({ id_event: parseInt(id) }, { matched: '' });
    }

    res.json({ updatedEvent });
};

export const remove: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const deletedEvent = await eventService.remove(parseInt(id));
    if (!deletedEvent) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    res.json({ deletedEvent: deletedEvent.id });
};
