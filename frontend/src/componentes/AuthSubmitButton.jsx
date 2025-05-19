function AuthSubmitButton({ isLoading, loadingText, defaultText }) {
  return (
    <button type="submit" disabled={isLoading}>
      {isLoading ? loadingText : defaultText}
    </button>
  );
}

export default AuthSubmitButton;
