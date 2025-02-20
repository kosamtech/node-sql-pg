import express from "express";
import UserRepository from "../repos/user-repo";

const router = express.Router();

router.get("/users", async (req, res) => {
    const users = await UserRepository.find();

    res.send(users);
});

router.get("/users/:id", async (req, res) => {
    const { id } = req.params;

    const user = await UserRepository.findById(id);

    if (user) {
        res.send(user);
    } else {
        res.sendStatus(404);
    }
});

router.post("/users", async (req, res) => {
    const { username, bio } = req.body;

    const user = await UserRepository.insert(username, bio);

    res.status(201).send(user);
});

router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, bio } = req.body;

    const user = await UserRepository.update(id, username, bio);

    if (user) {
        res.send(user);
    } else {
        res.sendStatus(404);
    }
});

router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    const user = await UserRepository.delete(id);

    if (user) {
        res.send(user);
    } else {
        res.sendStatus(404);
    }
});

export default router;
