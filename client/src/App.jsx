import { useSelector } from 'react-redux'
import UploadForm from './components/UploadForm'
import './App.css';
import ReconcileButton from './components/ReconcileButton';

function App(){
  const { uploadResult,reconcileResult, error, loading } = useSelector((state) => state.transactions);

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

      <ReconcileButton />

      {reconcileResult && (
        <div>
          <h3>Reconciliation Results</h3>
          <ul>
            <li>Exact matches: {reconcileResult.exactMatches}</li>
            <li>Fuzzy matches: {reconcileResult.fuzzyMatches}</li>
            <li>Missing from bank:{reconcileResult.missingBank}</li>
            <li>Missing from internal: {reconcileResult.missingInternal}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
