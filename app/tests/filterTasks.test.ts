import { describe, expect, it } from 'vitest'
import { mockTasks } from '../data/mockTasks'
import { defaultFilters, filterTasks } from '../utils/filterTasks'

describe('filterTasks', () => {
  it('retorna solo tareas cuyo título o descripción contiene el texto buscado (case-insensitive)', () => {
    const result = filterTasks(mockTasks, { ...defaultFilters, search: 'configurar' })

    expect(result).toHaveLength(2)
    result.forEach((task) => {
      const combined = (task.title + task.description).toLowerCase()
      expect(combined).toContain('configurar')
    })
  })

  it('aplica filtros de priority y status simultáneamente con AND lógico', () => {
    const result = filterTasks(mockTasks, { ...defaultFilters, priority: 'high', status: 'todo' })

    expect(result).toHaveLength(1)
    result.forEach((task) => {
      expect(task.priority).toBe('high')
      expect(task.status).toBe('todo')
    })
  })

  it('defaultFilters retorna todas las tareas sin modificar el array original', () => {
    const result = filterTasks(mockTasks, defaultFilters)

    expect(result).toHaveLength(mockTasks.length)
    expect(result).toEqual(mockTasks)
    expect(result).not.toBe(mockTasks)
  })

  it('retorna solo tareas que contienen el tag especificado', () => {
    const result = filterTasks(mockTasks, { ...defaultFilters, tag: 'devops' })

    expect(result).toHaveLength(2)
    result.forEach((task) => {
      expect(task.tags).toContain('devops')
    })
  })
})
