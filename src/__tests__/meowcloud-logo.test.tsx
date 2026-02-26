import { render } from '@testing-library/react'
import { MeowCloudLogo } from '@/components/meowcloud-logo'

describe('MeowCloudLogo', () => {
  it('renders an SVG element', () => {
    const { container } = render(<MeowCloudLogo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('uses default size of 24', () => {
    const { container } = render(<MeowCloudLogo />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('24')
  })

  it('accepts custom size prop', () => {
    const { container } = render(<MeowCloudLogo size={48} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('48')
  })

  it('has correct aria-label', () => {
    const { container } = render(<MeowCloudLogo />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-label')).toBe('MeowCloud')
  })
})
