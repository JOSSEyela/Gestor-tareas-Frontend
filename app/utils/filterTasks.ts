import type { Task, TaskFilters } from '../types'

export const defaultFilters: TaskFilters = {
  search: '',
  priority: 'all',
  status: 'all',
  tag: 'all',
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const search = filters.search.toLowerCase()

  return tasks.filter((task) => {
    if (search && !task.title.toLowerCase().includes(search) && !task.description.toLowerCase().includes(search)) {
      return false
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false
    }
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false
    }
    if (filters.tag !== 'all' && !task.tags.includes(filters.tag)) {
      return false
    }
    return true
  })
}

export function getUniqueTags(tasks: Task[]): string[] {
  const tagSet = new Set(tasks.flatMap((task) => task.tags))
  return [...tagSet].sort()
}
