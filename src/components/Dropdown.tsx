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
  disabled = false,
  required = false,
}: any) => {
  // Format options for react-select
  const formattedOptions = options.map((option: any) => ({
    value: option,
    label: option,
  }));

  // Find the currently selected option
  const selectedOption = formattedOptions.find(
    (opt: any) => opt.value === selected
  );

  return (
    <div className={`${width ? `w-${width}` : "w-64"}   `}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      <Select
        isDisabled={disabled}
        options={formattedOptions}
        value={selectedOption || ""} // Controlled value
        onChange={(selectedOption: any) => onChange(selectedOption?.value)} // Handle change
        menuPlacement="auto"
        menuPosition="fixed"
        className={`basic-single ${width && `w-${width}`}`}
        classNamePrefix="select"
      />
      {error && <p className="text-red-500 text-xs">{helperText}</p>}
    </div>
  );
};

export default Dropdown;
