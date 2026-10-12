// A label with an input, or a dropdown when "options" is given
function FormField({ label, name, type = 'text', value, onChange, options, inputRef, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select name={name} value={value} onChange={onChange}>
          <option value="">-- Select --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={inputRef}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

export default FormField;
