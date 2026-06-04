export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  createdAt: string
  dueDate: string | null
  tags: string[]
  userId: string
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'>
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>>

export interface TaskFilters {
  search: string
  priority: Priority | 'all'
  status: Status | 'all'
  tag: string | 'all'
}
