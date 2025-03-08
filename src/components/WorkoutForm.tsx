import { useState } from "react";
import "./WorkoutForm.css";

interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight: number;
}

const WorkoutForm = () => {
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("strength");
    const [exercises, setExercises] = useState<Exercise[]>([
        {
            name: "",
            sets: 0,
            reps: 0,
            weight: 0,
        },
    ]);

    const handleAddExercise = () => {
        setExercises([
            ...exercises,
            {
                name: "",
                sets: 0,
                reps: 0,
                weight: 0,
            },
        ]);
    };

    const handleExerciseChange = (
        index: number,
        field: string,
        value: string | number
    ) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            [field]: value,
        };
        setExercises(updatedExercises);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const workout = {
            date,
            category,
            exercises: exercises.map((ex) => ({
                ...ex,
                exercise: ex.name || "Unnamed Exercise",
            })),
        };

        try {
            const response = await fetch("http://localhost:5050/api/workouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workout),
            });

            if (!response.ok) {
                throw new Error("Failed to add workout");
            }

            // Reset form
            setDate("");
            setCategory("strength");
            setExercises([
                {
                    name: "",
                    sets: 0,
                    reps: 0,
                    weight: 0,
                },
            ]);

            alert("Workout added successfully!");
        } catch (error) {
            console.error("Error adding workout:", error);
            alert("Failed to add workout");
        }
    };

    return (
        <form className="workout-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                </select>
            </div>

            {exercises.map((exercise, index) => (
                <div key={index} className="exercise-group">
                    <h3>Exercise {index + 1}</h3>
                    <div className="form-group">
                        <label htmlFor={`exercise-name-${index}`}>Name:</label>
                        <input
                            type="text"
                            id={`exercise-name-${index}`}
                            value={exercise.name}
                            onChange={(e) =>
                                handleExerciseChange(
                                    index,
                                    "name",
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`sets-${index}`}>Sets:</label>
                        <input
                            type="number"
                            id={`sets-${index}`}
                            value={exercise.sets}
                            onChange={(e) =>
                                handleExerciseChange(
                                    index,
                                    "sets",
                                    parseInt(e.target.value)
                                )
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`reps-${index}`}>Reps:</label>
                        <input
                            type="number"
                            id={`reps-${index}`}
                            value={exercise.reps}
                            onChange={(e) =>
                                handleExerciseChange(
                                    index,
                                    "reps",
                                    parseInt(e.target.value)
                                )
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`weight-${index}`}>Weight (lbs):</label>
                        <input
                            type="number"
                            id={`weight-${index}`}
                            value={exercise.weight}
                            onChange={(e) =>
                                handleExerciseChange(
                                    index,
                                    "weight",
                                    parseInt(e.target.value)
                                )
                            }
                            required
                        />
                    </div>
                </div>
            ))}

            <button type="button" onClick={handleAddExercise}>
                + Add Exercise
            </button>

            <button type="submit">Add Workout</button>
        </form>
    );
};

export default WorkoutForm;
