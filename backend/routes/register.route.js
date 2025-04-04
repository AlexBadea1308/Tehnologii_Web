import express from "express";
import {createRegister } from "../controllers/register.controller.js";

const router = express.Router();

router.post("/", createRegister);

export default router;