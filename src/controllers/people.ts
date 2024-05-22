import { RequestHandler } from 'express';
import * as peopleService from '../services/people';
import { string, z } from 'zod';
import { desencryptMatch } from '../utils/matches';

export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const people = await peopleService.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
    });
    if (!people) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    res.json({ people });
};

export const getOne: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;

    const person = await peopleService.getOne({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
        id: parseInt(id),
    });
    if (!person) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    res.json({ person });
};

export const add: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const personSchema = z.object({
        name: z.string(),
        cpf: z.string().transform((val) => val.replace(/\.|-/gm, '')),
    });
    const body = personSchema.safeParse(req.body);
    if (!body.success) {
        return res.json('Dados incorretos/inválidos');
    }

    const newPerson = await peopleService.add({
        name: body.data.name,
        cpf: body.data.cpf,
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
    });
    if (!newPerson) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    res.json({ newPerson });
};

export const update: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;

    const personSchema = z.object({
        name: z.string().optional(),
        cpf: z
            .string()
            .transform((val) => val.replace(/\.|-/gm, ''))
            .optional(),
        matched: z.string().optional(),
    });
    const body = personSchema.safeParse(req.body);
    if (!body.success) {
        return res.json('Dados incorretos/inválidos');
    }

    const update = await peopleService.update(
        {
            id_event: parseInt(id_event),
            id_group: parseInt(id_group),
            id: parseInt(id),
        },
        {
            name: body.data.name,
            cpf: body.data.cpf,
            id_event: parseInt(id_event),
            id_group: parseInt(id_group),
        }
    );
    if (!update) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    const updatedPerson = await peopleService.getOne({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
        id: parseInt(id),
    });
    res.json({ updatedPerson });
};

export const remove: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;

    const deletedPerson = await peopleService.remove({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
        id: parseInt(id),
    });
    if (!deletedPerson) {
        return res.status(500).json({ error: 'Ocorreu um erro...' });
    }

    res.json({ deletedPerson: deletedPerson.id });
};

export const searchPerson: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const searchSchema = z.object({
        cpf: z.string().transform((val) => val.replace(/\.|-/gm, '')),
    });
    const query = searchSchema.safeParse(req.query);
    if (!query.success) {
        return res.json('Dados incorretos/inválidos');
    }

    const person = await peopleService.getOne({
        id_event: parseInt(id_event),
        cpf: query.data.cpf,
    });

    console.log(person);
    if (person && person.matched) {
        const matchedId = desencryptMatch(person.matched);
        const matchedPerson = await peopleService.getOne({
            id_event: parseInt(id_event),
            id: matchedId,
        });

        if (matchedPerson) {
            return res.json({ person: person.name, matchedPerson: matchedPerson.name });
        }
    }

    res.status(500).json({ error: 'Ocorreu um erro...' });
};
