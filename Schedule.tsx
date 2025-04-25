import { useTaskContext } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { TaskWithAssignee } from "@/types";
import TaskItem from "@/components/tasks/TaskItem";
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { enUS } from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  endOfWeek: (date) => endOfWeek(date, { weekStartsOn: 0 }),
  startOfMonth,
  endOfMonth,
  locales,
});

// Define the custom theme for the calendar
const calendarStyles = {
  '.rbc-event': {
    backgroundColor: 'hsl(var(--primary))',
    borderRadius: '4px',
  },
  '.rbc-day-slot .rbc-events-container': {
    marginRight: '0',
  },
  '.rbc-today': {
    backgroundColor: 'hsl(var(--primary) / 0.1)',
  },
  '.rbc-toolbar button:hover': {
    backgroundColor: 'hsl(var(--primary) / 0.1)',
    borderColor: 'hsl(var(--primary))',
  },
  '.rbc-toolbar button.rbc-active': {
    backgroundColor: 'hsl(var(--primary))',
    borderColor: 'hsl(var(--primary))',
  },
  '.rbc-toolbar button.rbc-active:hover': {
    backgroundColor: 'hsl(var(--primary) / 0.9)',
    borderColor: 'hsl(var(--primary))',
  },
  '.rbc-time-view': {
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.5rem',
  },
  '.rbc-month-view': {
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.5rem',
  },
};

// Interface for events
interface ChoreEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  assignee?: string;
  resource?: TaskWithAssignee;
}

export default function Schedule() {
  const { tasks, completeTask } = useTaskContext();
  const [view, setView] = useState<string>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<TaskWithAssignee | null>(null);

  // Convert tasks to events
  const events: ChoreEvent[] = tasks
    .filter(task => task.dueDate)
    .map(task => {
      const dueDate = new Date(task.dueDate!);
      const endDate = new Date(dueDate);
      endDate.setHours(dueDate.getHours() + 1); // 1 hour duration
      
      return {
        id: task.id,
        title: task.title,
        start: dueDate,
        end: endDate,
        assignee: task.assignee?.firstName,
        resource: task
      };
    });

  // Filter tasks for selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
  );

  // Custom event component to show assignee
  const EventComponent = ({ event }: { event: ChoreEvent }) => (
    <div className="text-xs">
      <div className="font-bold">{event.title}</div>
      {event.assignee && <div>{event.assignee}</div>}
    </div>
  );

  // Navigation functions
  const navigateToToday = () => setDate(new Date());
  const navigateToPrevious = () => {
    if (view === Views.MONTH) {
      setDate(subMonths(date, 1));
    } else {
      setDate(addDays(date, -7));
    }
  };
  const navigateToNext = () => {
    if (view === Views.MONTH) {
      setDate(addMonths(date, 1));
    } else {
      setDate(addDays(date, 7));
    }
  };

  // Handle event selection
  const handleSelectEvent = (event: ChoreEvent) => {
    if (event.resource) {
      setSelectedEvent(event.resource);
    }
  };

  // Handle slot/date selection
  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setSelectedEvent(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Schedule</h2>
        <p className="text-gray-600">View your household's chore schedule</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Chore Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateToPrevious}
                aria-label="Previous period"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateToToday}
                aria-label="Today"
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateToNext}
                aria-label="Next period"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="border-l pl-2 ml-2">
                <Button 
                  variant={view === Views.MONTH ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setView(Views.MONTH)}
                >
                  Month
                </Button>
                <Button 
                  variant={view === Views.WEEK ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setView(Views.WEEK)}
                >
                  Week
                </Button>
                <Button 
                  variant={view === Views.DAY ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setView(Views.DAY)}
                >
                  Day
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={calendarStyles}>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                view={view as any}
                date={date}
                onView={(newView) => setView(newView)}
                onNavigate={(newDate) => setDate(newDate)}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                components={{
                  event: EventComponent as any,
                }}
                eventPropGetter={() => ({
                  className: 'event-with-custom-styles',
                })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selected Event Details */}
          {selectedEvent && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Task</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                    {selectedEvent.description && (
                      <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Due Date</p>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.dueDate && format(new Date(selectedEvent.dueDate), "PPP p")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Assigned To</p>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.assignee?.firstName} {selectedEvent.assignee?.lastName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      onClick={() => selectedEvent.id && completeTask(selectedEvent.id)}
                      disabled={selectedEvent.completed}
                      variant={selectedEvent.completed ? "outline" : "default"}
                      className="w-full"
                    >
                      {selectedEvent.completed ? "Completed" : "Mark as Complete"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>
                Tasks for {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {tasksForSelectedDate.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onComplete={completeTask}
                      className="hover:bg-gray-50"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
