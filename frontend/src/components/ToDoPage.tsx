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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { PencilIcon, TrashIcon } from "@phosphor-icons/react";


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

  const updateTask = async (taskId: number, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed }
          : task
      )
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-3.6rem)] items-center justify-center">
      <Card className="relative w-full max-w-sm rounded-xl">
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
            <ContextMenu key={task.id}>
              <ContextMenuTrigger>
                <Field
                  orientation="horizontal"
                  className="cursor-context-menu rounded-md p-2 transition-colors hover:bg-accent/50"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    className={"rounded-sm size-5"}
                    checked={task.completed}
                    onCheckedChange={(checked) => {
                      if (typeof checked === "boolean") {
                        updateTask(task.id, checked);
                      }
                    }}
                  />

                  <FieldContent>
                    <FieldLabel
                      htmlFor={`task-${task.id}`}
                      className={
                        task.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {task.title}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              </ContextMenuTrigger>
              <ContextMenuContent className="rounded-lg">
                <ContextMenuGroup>
                  <ContextMenuItem>
                    <PencilIcon />
                    Edit
                  </ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                  <ContextMenuItem variant="destructive">
                    <TrashIcon />
                    Delete
                  </ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Input
            className="w-full rounded-lg"
            placeholder="What do you want to do today?"
            value={task}
            onChange={(event) => setTask(event.target.value)}
          />

          <Button
            type="button"
            className="w-20 rounded-lg"
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