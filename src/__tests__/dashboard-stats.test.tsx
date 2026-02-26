import { render, screen } from '@testing-library/react'
import { DashboardStats } from '@/components/dashboard-stats'

const defaultProps = {
  customerCount: 42,
  contactCount: 128,
  pendingTaskCount: 7,
  newCustomersThisMonth: 5,
}

describe('DashboardStats', () => {
  it('renders 4 stat cards', () => {
    const { container } = render(<DashboardStats {...defaultProps} />)
    const cards = container.querySelectorAll('[data-slot="card"]')
    expect(cards.length).toBe(4)
  })

  it('displays correct numbers', () => {
    render(<DashboardStats {...defaultProps} />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('128')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('displays correct labels', () => {
    render(<DashboardStats {...defaultProps} />)
    expect(screen.getByText('客戶總數')).toBeInTheDocument()
    expect(screen.getByText('聯絡人總數')).toBeInTheDocument()
    expect(screen.getByText('待辦任務數')).toBeInTheDocument()
    expect(screen.getByText('本月新增客戶')).toBeInTheDocument()
  })
})
