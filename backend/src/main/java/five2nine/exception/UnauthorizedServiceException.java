package five2nine.exception;

public class UnauthorizedServiceException
        extends RuntimeException {

    public UnauthorizedServiceException(String message) {
        super(message);
    }
}
