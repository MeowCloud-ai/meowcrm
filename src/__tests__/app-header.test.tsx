import { render, screen } from '@testing-library/react'

// Mock supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: () => Promise.resolve({ data: { user: { email: 'test@test.com' } } }),
      signOut: vi.fn(),
    },
  }),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

// Mock sidebar trigger
vi.mock('@/components/ui/sidebar', () => ({
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Menu</button>,
}))

import { AppHeader } from '@/components/app-header'

describe('AppHeader', () => {
  it('renders header element', () => {
    const { container } = render(<AppHeader />)
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('contains aurora line', () => {
    const { container } = render(<AppHeader />)
    expect(container.querySelector('.mc-aurora-line')).toBeInTheDocument()
  })

  it('has dark mode toggle button', () => {
    render(<AppHeader />)
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
  })
})
