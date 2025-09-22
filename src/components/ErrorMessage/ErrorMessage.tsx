
import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message}: ErrorMessageProps) => {
  return (
    
      <p className={css.text}>There was an error: {message}</p>
    
  );
};
