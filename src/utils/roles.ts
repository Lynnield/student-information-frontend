import type { UserRole } from '../types/api'

export const ROLE_LABELS: Record<UserRole, string> = {
  administrator: 'Administrator',
  registrar: 'Registrar',
  instructor: 'Instructor',
  student: 'Student',
}

export function canManageReferenceData(role: UserRole): boolean {
  return role === 'administrator' || role === 'registrar'
}

export function canManageStudents(role: UserRole): boolean {
  return role === 'administrator' || role === 'registrar'
}

export function canManageEnrollments(role: UserRole): boolean {
  return role === 'administrator' || role === 'registrar'
}

export function canManageGrades(role: UserRole): boolean {
  return (
    role === 'administrator' ||
    role === 'registrar' ||
    role === 'instructor'
  )
}

export function canDeleteGrades(role: UserRole): boolean {
  return role === 'administrator' || role === 'registrar'
}
