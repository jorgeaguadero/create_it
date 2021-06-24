import { useSelector, useDispatch } from 'react-redux';

const ErrorMessage = () => {
    const { message } = useSelector((state) => state.error);

    const dispatch = useDispatch();

    return message ? (
        <div className="error">
            <p>{message}</p>
            <div>
                <button onClick={() => dispatch({ type: 'CLEAR_ERROR' })}>OK!</button>
            </div>
        </div>
    ) : null;
};

export default ErrorMessage;
