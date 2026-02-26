import { render, screen } from '@testing-library/react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

import { CustomerList } from '@/app/(dashboard)/customers/customer-list'

const emptyProps = {
  customers: [],
  totalPages: 1,
  currentPage: 1,
  currentSearch: '',
  currentStatus: 'all',
  totalCount: 0,
}

const customer = {
  id: '1',
  name: 'Acme Corp',
  industry: 'Tech',
  status: 'active',
  created_at: '2025-01-01T00:00:00Z',
}

describe('CustomerList', () => {
  it('shows empty state when no customers', () => {
    render(<CustomerList {...emptyProps} />)
    expect(screen.getByText('尚無客戶資料')).toBeInTheDocument()
  })

  it('renders customer rows when data exists', () => {
    render(
      <CustomerList
        {...emptyProps}
        customers={[customer]}
        totalCount={1}
      />
    )
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Tech')).toBeInTheDocument()
  })

  it('shows pagination info', () => {
    render(
      <CustomerList
        {...emptyProps}
        customers={[customer]}
        totalCount={1}
        totalPages={1}
        currentPage={1}
      />
    )
    expect(screen.getByText('共 1 筆，第 1/1 頁')).toBeInTheDocument()
  })
})
