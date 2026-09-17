import { useDispatch } from "react-redux";
import { runReconciliation } from "../api/reconciliationApi";
import { setReconcileResult, setError, setLoading } from '../redux/transactionsSlice';


function ReconcileButton() {
    const dispatch = useDispatch();

    const handleRun = async () => {
        dispatch(setLoading(true));
        try{
            const result = await runReconciliation();
            dispatch(setReconcileResult(result));
      } catch (err){
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    return(
        <div>
            <h2>Reconciliation</h2>
            <button onClick={handleRun}>Run Reconciliation</button>
        </div>
    );
}


export default ReconcileButton;