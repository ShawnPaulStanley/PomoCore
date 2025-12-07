import React, { useState, useEffect } from 'react';
import { Plus, X, Check, ListTodo, Palette } from 'lucide-react';
import { Task } from '../types';

interface TasksProps {
  onTaskActivity?: (completed: boolean) => void;
}

export const Tasks: React.FC<TasksProps> = ({ onTaskActivity }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-pastel-peach');

  const colors = [
    { bg: 'bg-pastel-peach', border: 'border-orange-200', text: 'text-orange-800' },
    { bg: 'bg-pastel-mint', border: 'border-teal-200', text: 'text-teal-800' },
    { bg: 'bg-pastel-blue', border: 'border-sky-200', text: 'text-sky-800' },
    { bg: 'bg-pastel-lavender', border: 'border-indigo-200', text: 'text-indigo-800' },
    { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800' },
    { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-800' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('pomocore-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tasks");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pomocore-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      color: selectedColor
    };

    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newState = !t.completed;
        if (onTaskActivity) onTaskActivity(newState);
        return { ...t, completed: newState };
      }
      return t;
    }));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pastel-peach/30 rounded-xl text-orange-600 dark:text-orange-300">
          <ListTodo size={24} />
        </div>
        <h2 className="font-hand text-3xl text-pastel-text dark:text-pastel-darkText mt-1">Focus Tasks</h2>
      </div>
      
      {/* Input Area - Floating Card Style */}
      <div className="bg-white/40 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-sm">
        <form onSubmit={addTask} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's the goal?"
            className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-600 px-2 py-2 font-hand text-xl focus:outline-none focus:border-pastel-peach transition-colors placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-0 top-1 p-2 rounded-full bg-pastel-peach/80 hover:bg-pastel-peach text-white transition-all disabled:opacity-0 disabled:scale-75 shadow-sm"
          >
            <Plus size={18} />
          </button>
        </form>

        {/* Color Palette Picker */}
        <div className="flex gap-2 mt-3 pl-1 overflow-x-auto pb-1 scrollbar-hide">
          {colors.map((c) => (
            <button
              key={c.bg}
              type="button"
              onClick={() => setSelectedColor(c.bg)}
              className={`w-6 h-6 rounded-full transition-all duration-300 ${c.bg} border-2 ${selectedColor === c.bg ? 'border-gray-400 scale-110 shadow-sm' : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'}`}
              title="Select Color"
            />
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {tasks.length > 0 ? (
          tasks.map(task => {
            const themeColor = colors.find(c => c.bg === task.color) || colors[0];
            
            return (
              <div 
                key={task.id}
                className={`
                  group relative p-3 pl-4 rounded-xl transition-all duration-300 hover:shadow-md flex items-center gap-3
                  ${task.completed ? 'opacity-60 bg-gray-100/50 dark:bg-gray-800/50' : `${task.color} bg-opacity-60 dark:bg-opacity-20`}
                  border-l-4 ${themeColor.border}
                `}
              >
                {/* Custom Checkbox */}
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0
                    ${task.completed 
                      ? 'bg-gray-400 border-gray-400 text-white' 
                      : `border-gray-400/50 hover:border-gray-500 bg-white/50 dark:bg-black/20`}
                  `}
                >
                  {task.completed && <Check size={14} />}
                </button>

                <span 
                  className={`
                    flex-1 font-hand text-xl pt-1 transition-all duration-300 
                    ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}
                  `}
                >
                  {task.text}
                </span>

                {/* Delete Button (appears on hover) */}
                <button 
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 hover:bg-white/40 rounded-full transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })
        ) : (
          /* Empty State Illustration */
          <div className="flex flex-col items-center justify-center h-full opacity-60 min-h-[200px]">
            <div className="w-32 h-32 relative mb-4">
              <svg viewBox="0 0 200 200" className="w-full h-full text-pastel-peach animate-[float_4s_ease-in-out_infinite]">
                 {/* Cute clipboard doodle */}
                 <rect x="50" y="40" width="100" height="130" rx="10" fill="#FFF8E7" stroke="currentColor" strokeWidth="4" />
                 <rect x="70" y="30" width="60" height="20" rx="4" fill="currentColor" />
                 <line x1="70" y1="70" x2="130" y2="70" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
                 <line x1="70" y1="95" x2="130" y2="95" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
                 <line x1="70" y1="120" x2="110" y2="120" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
                 {/* Sleeping Zzz */}
                 <path d="M160 50 L170 50 L160 60 L170 60" stroke="#A5B4FC" strokeWidth="3" fill="none" className="animate-pulse" />
                 <path d="M175 35 L180 35 L175 40 L180 40" stroke="#A5B4FC" strokeWidth="2" fill="none" className="animate-pulse delay-75" />
              </svg>
            </div>
            <p className="font-hand text-xl text-gray-400 text-center">No tasks yet.<br/>Time to chill (or plan).</p>
          </div>
        )}
      </div>
    </div>
  );
};