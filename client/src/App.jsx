import { useSelector } from 'react-redux'
import UploadForm from './components/UploadForm'
import './App.css';

function App(){
  const { uploadResult, error, loading } = useSelector((state) => state.transactions);

  return (
    <div>
      <h1>Reconciliation Engine</h1>
      <UploadForm />

      {loading && <p>Uploading...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {uploadResult && (
        <p style={{ color: 'green' }}>
          Success! Insterted {uploadResult.inserted} transactions
        </p>
      )}
    </div>
  );
}

export default App
