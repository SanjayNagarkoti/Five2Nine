package five2nine.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String message)
    {
        super(message);
    }

}