<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index()
    {
        // Retrieve all tasks from the database
        return response()->json(Task::all());
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Create a new task with the validated data
        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    /**
     * Display the specified task.
     */
    public function show($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        return response()->json($task);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        // Validate the request
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'completed' => 'sometimes|boolean',
        ]);

        // Update task with validated data
        $task->update($validated);

        return response()->json($task);
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        // Delete the task
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
