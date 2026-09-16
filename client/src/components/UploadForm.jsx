import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { uploadInternalCSV, uploadBankCSV } from '../api/reconciliationApi'
import { setUploadResult, setError, setLoading } from '../redux/transactionsSlice'

function UploadForm(){
    const dispatch = useDispatch();
    const [internalFile, setInternalFile] = useState(null);
    const [bankFile, setBankFile] = useState(null);

    const handleInternalUpload = async () => {
        if(!internalFile) return;
        dispatch(setLoading(true));
        try{
            const result = await uploadInternalCSV(internalFile);
            dispatch(setUploadResult(result));
        } catch(err) {
            dispatch(setError(err.message));
        }finally {
            dispatch(setLoading(false));
        }
    };

    const handleBankUpload = async () =>{
        if(!bankFile) return;
        dispatch(setLoading(true));
        try{
            const result = await uploadBankCSV(bankFile);
            dispatch(setUploadResult(result));
        } catch (err) {
            dispatch(setError(err.message));
        } finally{
            dispatch(setLoading(false));
        }
    };

    return (
        <div>
            <h2>Upload Transactions</h2>

            <div>
                <label>Internal Transactions CSV:</label>
                <input
                    type="file"
                    accept='.csv'
                    onChange={(e) => setInternalFile(e.target.files[0])}
                />
                <button onClick={handleInternalUpload}>Upload Internal</button>
            </div>

            <div>
                <label>Bank Transactions CSV: </label>
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setBankFile(e.target.files[0])}
                />
                <button onClick={handleBankUpload}>Upload Bank</button>
            </div>

        </div>

    );
};

export default UploadForm;
