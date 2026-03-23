import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div>
      <h1>Your music and you</h1>
      <Link to="/upload">Get started</Link>
    </div>
  )
}

export default Landing