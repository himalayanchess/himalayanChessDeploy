import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
const Dropdown = ({
  label,
  options,
  selected,
  onChange,
  width,
  error,
  helperText,
}) => {
  const formattedOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  return (
    <div className={`${width ? `w-${width}` : "w-64"}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Select
        options={formattedOptions}
        value={formattedOptions.find((opt) => opt.value === selected)}
        onChange={(selectedOption) => onChange(selectedOption.value)}
        className={`basic-single ${width && `w-${width}`}`}
        classNamePrefix="select"
      />
      {error && <p className="text-red-500 text-xs">{helperText}</p>}
    </div>
  );
};

export default Dropdown;
