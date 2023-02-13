import { useState } from "react";
import Select from "./components/Select";
import type { SelectOption } from "./components/Select";

const options: SelectOption[] = [
  {
    label: "apple",
    value: "apple",
  },
  {
    label: "banana",
    value: "banana",
  },
  {
    label: "cat",
    value: "cat",
  },
  {
    label: "dog",
    value: "dog",
  },
  {
    label: "elephant",
    value: "elephant",
  },
];

function App() {
  const [value, setValue] = useState<SelectOption>();
  const [value2, setValue2] = useState<SelectOption[]>([]);
  return (
    <>
      <Select value={value} options={options} onChange={(v) => setValue(v)} />
      <br />
      <Select
        multiple
        value={value2}
        options={options}
        onChange={(v) => setValue2(v)}
      />
      <button>123</button>
    </>
  );
}

export default App;
