package five2nine.exception;

public class InvalidResetTokenException extends RuntimeException{
    public InvalidResetTokenException(String message) {
        super(message);
    }
}
