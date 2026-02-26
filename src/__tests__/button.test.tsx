import { render } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders default variant', () => {
    const { container } = render(<Button>Click</Button>)
    const btn = container.querySelector('button')!
    expect(btn).toBeInTheDocument()
    expect(btn.textContent).toBe('Click')
  })

  it('has rounded-full class by default', () => {
    const { container } = render(<Button>Test</Button>)
    const btn = container.querySelector('button')!
    expect(btn.className).toContain('rounded-full')
  })

  it('renders destructive variant', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    const btn = container.querySelector('button')!
    expect(btn.className).toContain('bg-destructive')
  })

  it('renders outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    const btn = container.querySelector('button')!
    expect(btn.getAttribute('data-variant')).toBe('outline')
  })

  it('renders ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    const btn = container.querySelector('button')!
    expect(btn.getAttribute('data-variant')).toBe('ghost')
  })

  it('renders link variant', () => {
    const { container } = render(<Button variant="link">Link</Button>)
    const btn = container.querySelector('button')!
    expect(btn.getAttribute('data-variant')).toBe('link')
  })
})
