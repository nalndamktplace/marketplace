import { ErrorMessage, Field } from "formik";

function TextInput({
  label,
  htmlType = "text",
  name = "",
  placeholder,
}: {
  label?: string;
  htmlType?: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div className="mb-3">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      {htmlType == "textarea" ? (
        <div>
          <Field name={name}>
            {({ field }: any) => (
              <textarea
                {...field}
                name={name}
                placeholder={placeholder}
                className="w-full p-2 mt-1 text-black transition-colors duration-300 bg-white border rounded-md focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2"
              />
            )}
          </Field>
          <div className="mt-1 text-xs text-red-400">
            <ErrorMessage name={name} />
          </div>
        </div>
      ) : (
        <div>
          <Field name={name}>
            {({ field }: any) => (
              <input
                {...field}
                type={htmlType}
                placeholder={placeholder}
                className="w-full p-2 mt-1 text-black transition-colors duration-300 bg-white border rounded-md focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2"
              />
            )}
          </Field>
          <div className="mt-1 text-xs text-red-400">
            <ErrorMessage name={name} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TextInput;
