import { useState } from "react";
import "./WorkoutForm.css";

interface Exercise {
    name: string;
    sets: number | null;
    reps: number | null;
    weight: number | null;
    duration: number | null;
    speed: number | null;
    incline: number | null;
}

const WorkoutForm = () => {
    const [date, setDate] = useState("");
    const exerciseOptions = [
        "Curls",
        "Hammer Curls",
        "Preacher Curls",
        "Seated Rows",
        "Lateral Pulldowns",
        "Pull-ups",
        "Bench",
        "Incline Bench",
        "Chest Flys",
        "Tricep Extensions",
        "Rope Pulldowns",
        "Dips",
        "Squat",
        "Leg Curl",
        "Calf Raises",
        "Overhead Press (OHP)",
        "Lateral Raises",
        "Shrugs",
        "Treadmill",
        "Leg Raises",
    ];

    const [exercises, setExercises] = useState<Exercise[]>([
        {
            name: "",
            sets: 0,
            reps: 0,
            weight: 0,
            duration: 0,
            speed: 0,
            incline: 0,
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
                duration: 0,
                speed: 0,
                incline: 0,
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
            [field]: value === "" ? null : value,
        };
        setExercises(updatedExercises);
    };

    const getInputValue = (value: number | null): string | number => {
        return value === null ? "" : value;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate exercise names
        const invalidExercises = exercises.filter(
            (ex) => !exerciseOptions.includes(ex.name)
        );

        if (invalidExercises.length > 0) {
            alert("Please select valid exercise names from the list");
            return;
        }

        const workout = {
            date,
            exercises: exercises.map((ex) => {
                const exerciseData = {
                    ...ex,
                    exercise: ex.name || "Unnamed Exercise",
                };

                // Set unused fields to null based on exercise type
                if (ex.name === "Treadmill") {
                    exerciseData.sets = null;
                    exerciseData.reps = null;
                    exerciseData.weight = null;
                } else {
                    exerciseData.duration = null;
                    exerciseData.speed = null;
                    exerciseData.incline = null;
                }

                return exerciseData;
            }),
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
            setExercises([
                {
                    name: "",
                    sets: 0,
                    reps: 0,
                    weight: 0,
                    duration: 0,
                    speed: 0,
                    incline: 0,
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

            {exercises.map((exercise, index) => (
                <div key={index} className="exercise-group">
                    <h3>Exercise {index + 1}</h3>
                    <div className="form-group">
                        <label htmlFor={`exercise-name-${index}`}>Name:</label>
                        <select
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
                        >
                            <option value="">Select an exercise</option>
                            {exerciseOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    {exercise.name === "" ? null : exercise.name !==
                      "Treadmill" ? (
                        <>
                            <div className="form-group">
                                <label htmlFor={`sets-${index}`}>Sets:</label>
                                <input
                                    type="number"
                                    id={`sets-${index}`}
                                    value={getInputValue(exercise.sets)}
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
                                    value={getInputValue(exercise.reps)}
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
                                <label htmlFor={`weight-${index}`}>
                                    Weight (lbs):
                                </label>
                                <input
                                    type="number"
                                    id={`weight-${index}`}
                                    value={getInputValue(exercise.weight)}
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
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor={`duration-${index}`}>
                                    Distance (miles):
                                </label>
                                <input
                                    type="number"
                                    id={`duration-${index}`}
                                    value={getInputValue(exercise.duration)}
                                    onChange={(e) =>
                                        handleExerciseChange(
                                            index,
                                            "duration",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`speed-${index}`}>Speed:</label>
                                <input
                                    type="number"
                                    id={`speed-${index}`}
                                    value={getInputValue(exercise.speed)}
                                    onChange={(e) =>
                                        handleExerciseChange(
                                            index,
                                            "speed",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`incline-${index}`}>
                                    Incline (%):
                                </label>
                                <input
                                    type="number"
                                    id={`incline-${index}`}
                                    value={getInputValue(exercise.incline)}
                                    onChange={(e) =>
                                        handleExerciseChange(
                                            index,
                                            "incline",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    required
                                />
                            </div>
                        </>
                    )}
                </div>
            ))}

            <button type="button" onClick={handleAddExercise}>
                + Add Exercise
            </button>

            <button type="submit">Add Workout</button>
            <button className="stats-button" type="button">
                Stats
            </button>
        </form>
    );
};

export default WorkoutForm;
