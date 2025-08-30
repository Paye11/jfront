import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const InputField = ({
  id,
  label,
  type = 'text',
  register,
  error,
  rules,
  placeholder,
  disabled = false,
  helperText,
  required = false,
  value,
  showPasswordToggle = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasError = !!error;
  const isValid = !hasError && value && value.length > 0;

  const inputClasses = `
    w-full px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 
    border-2 rounded-xl transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-0
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${
      hasError
        ? 'border-red-400 focus:border-red-500 bg-red-50/30'
        : isValid
        ? 'border-green-400 focus:border-green-500 bg-green-50/30'
        : isFocused
        ? 'border-blue-500 bg-blue-50/30 shadow-lg shadow-blue-100'
        : 'border-gray-200 hover:border-gray-300 bg-white'
    }
  `
    .trim()
    .replace(/\s+/g, ' ');

  const labelClasses = `
    block text-sm font-semibold mb-2 transition-colors duration-200
    ${
      hasError
        ? 'text-red-600'
        : isValid
        ? 'text-green-600'
        : isFocused
        ? 'text-blue-600'
        : 'text-gray-700'
    }
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...register(id, rules)}
        />

        {/* Right side icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          {/* Validation icon */}
          {hasError && <AlertCircle className="w-5 h-5 text-red-500" />}
          {isValid && <Check className="w-5 h-5 text-green-500" />}

          {/* Password toggle */}
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
              tabIndex={-1}>
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Focus ring effect */}
        {isFocused && !hasError && (
          <div className="absolute inset-0 rounded-xl ring-4 ring-blue-100 pointer-events-none transition-opacity duration-200" />
        )}
      </div>

      {/* Helper text and error messages */}
      <div className="min-h-[20px] space-y-1">
        {error && (
          <p className="text-red-600 text-sm font-medium flex items-center gap-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error.message}
          </p>
        )}

        {!error && helperText && (
          <p className="text-gray-500 text-sm">{helperText}</p>
        )}
      </div>
    </div>
  );
};

export default InputField;
