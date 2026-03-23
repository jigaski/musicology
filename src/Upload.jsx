import { useState } from 'react'
function Upload() {
  const [data, setData] = useState(null)

  function handleFileUpload(event) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const parsed = JSON.parse(e.target.result)
      setData(parsed)
      console.log(parsed)
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <h1>Musicology</h1>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      {data && <p>Loaded {data.length} entries</p>}
    </div>
  )
}
export default Upload