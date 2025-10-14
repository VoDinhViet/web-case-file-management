"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  MessageSquare,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Activity, ActivityType, Note, Task, TaskStatus } from "@/types";

interface CaseTimelineProps {
  startDate?: Date | string;
  endDate?: Date | string;
  activities?: Activity[];
  tasks?: Task[];
  notes?: Note[];
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "note":
      return MessageSquare;
    case "task":
      return CheckCircle2;
    case "status_change":
      return Circle;
    case "assignment":
      return User;
    case "created":
    case "updated":
      return FileText;
    default:
      return Circle;
  }
}

function getTaskStatusColor(status: TaskStatus) {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-700 border-green-200";
    case "in_progress":
      return "bg-blue-500/10 text-blue-700 border-blue-200";
    case "todo":
      return "bg-gray-500/10 text-gray-700 border-gray-200";
    case "cancelled":
      return "bg-red-500/10 text-red-700 border-red-200";
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-200";
  }
}

function getTaskStatusLabel(status: TaskStatus) {
  switch (status) {
    case "completed":
      return "Hoàn thành";
    case "in_progress":
      return "Đang làm";
    case "todo":
      return "Chưa làm";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}

export function CaseTimeline({
  startDate,
  endDate,
  activities = [],
  tasks = [],
  notes = [],
}: CaseTimelineProps) {
  // Combine all items with timestamps for timeline
  const timelineItems: Array<{
    id: string;
    type: "activity" | "task" | "note" | "milestone";
    timestamp: Date;
    data: Activity | Task | Note | { label: string; date: Date };
  }> = [];

  // Add start date milestone
  if (startDate) {
    timelineItems.push({
      id: `milestone-start`,
      type: "milestone",
      timestamp: new Date(startDate),
      data: { label: "Ngày khởi tố", date: new Date(startDate) },
    });
  }

  // Add end date milestone
  if (endDate) {
    timelineItems.push({
      id: `milestone-end`,
      type: "milestone",
      timestamp: new Date(endDate),
      data: { label: "Ngày hết hạn", date: new Date(endDate) },
    });
  }

  // Add activities
  activities.forEach((activity) => {
    timelineItems.push({
      id: activity.id,
      type: "activity",
      timestamp: new Date(activity.createdAt),
      data: activity,
    });
  });

  // Add tasks
  tasks.forEach((task) => {
    timelineItems.push({
      id: task.id,
      type: "task",
      timestamp: new Date(task.createdAt),
      data: task,
    });
  });

  // Add notes
  notes.forEach((note) => {
    timelineItems.push({
      id: note.id,
      type: "note",
      timestamp: new Date(note.createdAt),
      data: note,
    });
  });

  // Sort by timestamp (newest first)
  timelineItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-4">
      {timelineItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có hoạt động nào</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          {timelineItems.map((item) => (
            <div key={item.id} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted">
                {item.type === "milestone" ? (
                  <Calendar className="h-5 w-5 text-primary" />
                ) : item.type === "task" ? (
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                ) : item.type === "note" ? (
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <Card>
                <CardContent className="p-4">
                  {item.type === "milestone" ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {(item.data as { label: string }).label}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Milestone
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(item.timestamp, "dd/MM/yyyy", { locale: vi })}
                      </p>
                    </div>
                  ) : item.type === "task" ? (
                    <TaskItem task={item.data as Task} />
                  ) : item.type === "note" ? (
                    <NoteItem note={item.data as Note} />
                  ) : (
                    <ActivityItem activity={item.data as Activity} />
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Task Item Component
function TaskItem({ task }: { task: Task }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{task.title}</span>
            <Badge
              variant="outline"
              className={getTaskStatusColor(task.status)}
            >
              {getTaskStatusLabel(task.status)}
            </Badge>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>
              {format(new Date(task.createdAt), "dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </span>
            {task.assignedUserName && (
              <>
                <Separator orientation="vertical" className="h-3" />
                <span>Người thực hiện: {task.assignedUserName}</span>
              </>
            )}
            {task.dueDate && (
              <>
                <Separator orientation="vertical" className="h-3" />
                <span>
                  Hạn:{" "}
                  {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: vi })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Note Item Component
function NoteItem({ note }: { note: Note }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare className="h-4 w-4 text-purple-600" />
        <span className="font-semibold text-sm">Ghi chú</span>
      </div>
      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", {
            locale: vi,
          })}
        </span>
        {note.userName && (
          <>
            <Separator orientation="vertical" className="h-3" />
            <span>Bởi: {note.userName}</span>
          </>
        )}
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }: { activity: Activity }) {
  const Icon = getActivityIcon(activity.type);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold text-sm">{activity.title}</span>
      </div>
      {activity.description && (
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          {format(new Date(activity.createdAt), "dd/MM/yyyy HH:mm", {
            locale: vi,
          })}
        </span>
        {activity.userName && (
          <>
            <Separator orientation="vertical" className="h-3" />
            <span>Bởi: {activity.userName}</span>
          </>
        )}
      </div>
    </div>
  );
}
