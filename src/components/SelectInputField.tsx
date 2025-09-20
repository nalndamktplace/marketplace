import { Select } from "antd";
import { ErrorMessage } from "formik";

const SelectInputField = (props: any) => {
  return (
    <>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          {props?.label}
        </label>
        <Select
          placeholder="Select book language"
          style={{ width: "100%" }}
          {...props}
          onChange={(e) => {
            props?.setFieldValue(props.name, e);
          }}
          // options={props?.options}
          size="large"
        />

        <div className="mt-1 text-xs text-red-400">
          <ErrorMessage name={props?.name} />
        </div>
      </div>
    </>
  );
};

export default SelectInputField;
