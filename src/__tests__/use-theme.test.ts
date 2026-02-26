import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/lib/hooks/use-theme'

// Mock localStorage
const storage: Record<string, string> = {}
beforeEach(() => {
  Object.keys(storage).forEach((k) => delete storage[k])
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((k: string) => storage[k] ?? null),
    setItem: vi.fn((k: string, v: string) => { storage[k] = v }),
    removeItem: vi.fn((k: string) => { delete storage[k] }),
  })
  document.documentElement.classList.remove('dark')
})

describe('useTheme', () => {
  it('defaults to light theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('toggleTheme switches light to dark', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme switches dark back to light', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('setTheme sets theme directly', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('dark'))
    expect(result.current.theme).toBe('dark')
    expect(localStorage.setItem).toHaveBeenCalledWith('meowcrm-theme', 'dark')
  })
})
