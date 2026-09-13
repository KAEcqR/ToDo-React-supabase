import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {
  Field,
  FieldContent,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

const ToDoPage = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    setTasks(data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addNewTask = async () => {
    if (!task.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: task.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
      return;
    }

    setTasks((currentTasks) => [data, ...currentTasks]);
    setTask("");
  };

  return (
    <div className="flex min-h-[calc(100vh-3.6rem)] items-center justify-center">
      <Card className="relative w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            My ToDo's
          </CardTitle>

          <CardDescription>
            From here you will be able to manage your tasks for today
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <Field
              key={task.id}
              orientation="horizontal"
            >
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
              />

              <FieldContent>
                <FieldLabel htmlFor={`task-${task.id}`}>
                  {task.title}
                </FieldLabel>
              </FieldContent>
            </Field>
          ))}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Input
            className="w-full"
            placeholder="What do you want to do today?"
            value={task}
            onChange={(event) => setTask(event.target.value)}
          />

          <Button
            type="button"
            className="w-20"
            onClick={addNewTask}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ToDoPage;