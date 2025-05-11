import React from "react";

export type TaskItem = {
  id: string;
  title: string;
  done: boolean;
  dueDate?: string | Date;
};

interface TaskListProps {
  tasks?: TaskItem[];
  onToggle?: (id: string, done: boolean) => void;
}

const dummy: TaskItem[] = [
  { id: "1", title: "Send onboarding email", done: false, dueDate: new Date(Date.now() + 86400_000) },
  { id: "2", title: "Review contract", done: true },
  { id: "3", title: "Schedule intro call", done: false },
];

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle }) => (
  <ul className="space-y-3">
    {(tasks && tasks.length ? tasks : dummy).map(task => (
      <li key={task.id} className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.done}
          onChange={e => onToggle?.(task.id, e.target.checked)}
          className="accent-electric"
          aria-label="Toggle task"
        />
        <span className={`flex-1 ${task.done ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
        {task.dueDate && <span className="text-xs text-muted-foreground">Due {typeof task.dueDate === 'string' ? task.dueDate : task.dueDate.toLocaleDateString()}</span>}
      </li>
    ))}
  </ul>
);

export default TaskList; 