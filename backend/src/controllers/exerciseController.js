import { createNewExercise, deleteExerciseById, getAllExercises, updateInfoExercise } from "../services/exerciseService.js";

export const getExercises = async (req, res) => {
    try {
        const exercises = await getAllExercises();

        if (!exercises)
            return res.status(204).json({ exercises })

        return res.status(200).json(exercises);
    } catch (err) {
        console.log("Lỗi trong quá trình get exercises: ", err);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
};

export const createExercise = async (req, res) => {
    try {
        const { name, description, category, muscle_group } = req.body;
        const userId = req.user.id;

        if (!name || !description || !category || !muscle_group)
            return res.status(400).json({ message: "Không thể thiếu name, description, category, muscle_group" })

        const exercise = await createNewExercise(name, description, category, muscle_group, userId);

        return res.status(201).json(exercise);
    } catch (err) {
        console.log("Lỗi trong quá trình create exercise: ", err)
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const updateExercise = async (req, res) => {
    try {
        const exercise = await updateInfoExercise(
            req.params.id,
            req.body,
            req.user
        );

        return res.status(200).json(exercise);
    } catch (err) {
        if (err.message === 'NOT_FOUND')
            return res.status(404).json({ message: 'Not found' });
        if (err.message === 'FORBIDDEN')
            return res.status(403).json({ message: 'Forbidden' });

        res.status(400).json({ message: err.message });
    }
};

export const deleteExercise = async (req, res) => {
    try {
        await deleteExerciseById(
            req.params.id,
            req.user
        );
        return res.sendStatus(204);
    } catch (err) {
        if (err.message === 'NOT_FOUND')
            return res.status(404).json({ message: 'Not found' });
        if (err.message === 'FORBIDDEN')
            return res.status(403).json({ message: 'Forbidden' });

        res.status(400).json({ message: err.message });
    }
};

export const getExerciseBySearch = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("Lỗi trong quá trình getExerciseBySearch: ", err)
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}