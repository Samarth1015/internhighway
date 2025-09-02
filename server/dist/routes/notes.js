"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NoteController_1 = require("../controllers/NoteController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const noteController = new NoteController_1.NoteController();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateUser);
router.use(auth_1.validateUser);
// GET /api/notes - Get all notes for the authenticated user
router.get('/', (req, res) => noteController.getNotes(req, res));
// POST /api/notes - Create a new note
router.post('/', (req, res) => noteController.createNote(req, res));
// GET /api/notes/:id - Get a specific note
router.get('/:id', (req, res) => noteController.getNoteById(req, res));
// PUT /api/notes/:id - Update a note
router.put('/:id', (req, res) => noteController.updateNote(req, res));
// DELETE /api/notes/:id - Delete a note
router.delete('/:id', (req, res) => noteController.deleteNote(req, res));
// PATCH /api/notes/:id/archive - Archive/unarchive a note
router.patch('/:id/archive', (req, res) => noteController.archiveNote(req, res));
exports.default = router;
