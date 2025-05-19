function AuthFormField({ label, type, id, value, onChange, required, disabled }) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    </>
  );
}

export default AuthFormField;
