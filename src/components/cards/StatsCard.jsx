import './Card.css'

export default function StatsCard({ children, className = '', ...props }) {
  return (
    <div className={`stats-card ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
