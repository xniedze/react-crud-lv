import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { _enum } from "@hilla/form";
import { DatePicker } from "@hilla/react-components/DatePicker.js";
import { Item } from "@hilla/react-components/Item.js";
import { ListBox } from "@hilla/react-components/ListBox.js";
import { NumberField } from "@hilla/react-components/NumberField.js";
import { Select } from "@hilla/react-components/Select.js";
import { TextField } from "@hilla/react-components/TextField.js";
import { TimePicker } from "@hilla/react-components/TimePicker.js";
import { useContext, useEffect, useRef, useState } from "react";
import { ColumnContext } from "./autogrid-column-context.js";
import { useDatePickerI18n } from "./locale.js";
import Matcher from "./types/dev/hilla/crud/filter/PropertyStringFilter/Matcher.js";
import { convertToTitleCase } from "./util";
function useFilterState(initialMatcher) {
  const context = useContext(ColumnContext);
  const [matcher, setMatcher] = useState(initialMatcher);
  const [filterValue, setFilterValue] = useState("");
  function updateFilter(newMatcher, newFilterValue) {
    setFilterValue(newFilterValue);
    setMatcher(newMatcher);
    const filter = {
      "@type": "propertyString",
      propertyId: context.propertyInfo.name,
      filterValue: newFilterValue,
      matcher: newMatcher
    };
    context.setPropertyFilter(filter);
  }
  return { matcher, filterValue, updateFilter };
}
function useSelectInitWorkaround(selectRef) {
  useEffect(() => {
    setTimeout(() => {
      if (selectRef.current) {
        selectRef.current.requestContentUpdate();
      }
    }, 1);
  }, []);
}
function ComparationSelection({ onMatcherChanged, value }) {
  const select = useRef(null);
  useSelectInitWorkaround(select);
  return /* @__PURE__ */ jsx(
    Select,
    {
      theme: "small",
      className: "auto-grid-comparation-selection",
      ref: select,
      value,
      onValueChanged: ({ detail }) => {
        onMatcherChanged(detail.value);
      },
      renderer: () => /* @__PURE__ */ jsxs(ListBox, { children: [
        /* @__PURE__ */ jsx(Item, { value: Matcher.GREATER_THAN, ...{ label: ">" }, children: "> Greater than" }),
        /* @__PURE__ */ jsx(Item, { value: Matcher.LESS_THAN, ...{ label: "<" }, children: "< Less than" }),
        /* @__PURE__ */ jsx(Item, { value: Matcher.EQUALS, ...{ label: "=" }, children: "= Equals" })
      ] })
    }
  );
}
function StringHeaderFilter() {
  const context = useContext(ColumnContext);
  const { filterPlaceholder, filterDebounceTime, filterMinLength } = context.customColumnOptions ?? {};
  const { updateFilter } = useFilterState(Matcher.CONTAINS);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (filterMinLength && inputValue && inputValue.length < filterMinLength) {
      updateFilter(Matcher.CONTAINS, "");
      return () => {
      };
    }
    const delayInputTimeoutId = setTimeout(() => {
      updateFilter(Matcher.CONTAINS, inputValue);
    }, filterDebounceTime ?? 200);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue]);
  return /* @__PURE__ */ jsx("div", { className: "auto-grid-string-filter", children: /* @__PURE__ */ jsx(
    TextField,
    {
      theme: "small",
      placeholder: filterPlaceholder ?? "Filter...",
      onInput: (e) => {
        const fieldValue = e.target.value;
        setInputValue(fieldValue);
      }
    }
  ) });
}
function NumberHeaderFilter() {
  const context = useContext(ColumnContext);
  const { filterPlaceholder, filterDebounceTime } = context.customColumnOptions ?? {};
  const [inputValue, setInputValue] = useState("");
  const { matcher, filterValue, updateFilter } = useFilterState(Matcher.GREATER_THAN);
  const select = useRef(null);
  useSelectInitWorkaround(select);
  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      updateFilter(matcher, inputValue);
    }, filterDebounceTime ?? 200);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue]);
  return /* @__PURE__ */ jsxs("div", { className: "auto-grid-number-filter", children: [
    /* @__PURE__ */ jsx(ComparationSelection, { value: matcher, onMatcherChanged: (m) => updateFilter(m, filterValue) }),
    /* @__PURE__ */ jsx(
      NumberField,
      {
        theme: "small",
        placeholder: filterPlaceholder ?? "Filter...",
        onInput: (e) => {
          const fieldValue = e.target.value;
          setInputValue(fieldValue);
        }
      }
    )
  ] });
}
function EnumHeaderFilter() {
  const { filterValue, updateFilter } = useFilterState(Matcher.EQUALS);
  const context = useContext(ColumnContext);
  const model = context.propertyInfo.model;
  const options = [
    {
      value: "",
      label: ""
    },
    ...Object.keys(model[_enum]).map((value) => ({
      label: convertToTitleCase(value),
      value
    }))
  ];
  return /* @__PURE__ */ jsx("div", { className: "auto-grid-enum-filter", children: /* @__PURE__ */ jsx(
    Select,
    {
      theme: "small",
      items: options,
      value: filterValue,
      onValueChanged: (e) => {
        const newFilterValue = e.detail.value;
        updateFilter(Matcher.EQUALS, newFilterValue);
      }
    }
  ) });
}
function BooleanHeaderFilter() {
  const { filterValue, updateFilter } = useFilterState(Matcher.EQUALS);
  const select = useRef(null);
  useSelectInitWorkaround(select);
  return /* @__PURE__ */ jsx("div", { className: "auto-grid-boolean-filter", children: /* @__PURE__ */ jsx(
    Select,
    {
      theme: "small",
      ref: select,
      onValueChanged: (e) => {
        const newFilterValue = e.detail.value;
        updateFilter(Matcher.EQUALS, newFilterValue);
      },
      renderer: () => /* @__PURE__ */ jsxs(ListBox, { children: [
        /* @__PURE__ */ jsx(Item, { value: "", ...{ label: "" } }),
        /* @__PURE__ */ jsx(Item, { value: "True", ...{ label: "Yes" }, children: "Yes" }),
        /* @__PURE__ */ jsx(Item, { value: "False", ...{ label: "No" }, children: "No" })
      ] }),
      value: filterValue
    }
  ) });
}
function DateHeaderFilter() {
  const context = useContext(ColumnContext);
  const i18n = useDatePickerI18n();
  const { matcher, filterValue, updateFilter } = useFilterState(Matcher.GREATER_THAN);
  const [invalid, setInvalid] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "auto-grid-date-filter", children: [
    /* @__PURE__ */ jsx(ComparationSelection, { value: matcher, onMatcherChanged: (m) => updateFilter(m, filterValue) }),
    /* @__PURE__ */ jsx(
      DatePicker,
      {
        theme: "small",
        value: filterValue,
        placeholder: context.customColumnOptions?.filterPlaceholder ?? "Filter...",
        i18n,
        onInvalidChanged: ({ detail: { value } }) => {
          setInvalid(value);
        },
        onValueChanged: ({ detail: { value } }) => {
          if (!(invalid || value === filterValue)) {
            updateFilter(matcher, value);
          }
        }
      }
    )
  ] });
}
function TimeHeaderFilter() {
  const context = useContext(ColumnContext);
  const { matcher, filterValue, updateFilter } = useFilterState(Matcher.GREATER_THAN);
  const [invalid, setInvalid] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "auto-grid-time-filter", children: [
    /* @__PURE__ */ jsx(ComparationSelection, { value: matcher, onMatcherChanged: (m) => updateFilter(m, filterValue) }),
    /* @__PURE__ */ jsx(
      TimePicker,
      {
        theme: "small",
        value: filterValue,
        placeholder: context.customColumnOptions?.filterPlaceholder ?? "Filter...",
        onInvalidChanged: ({ detail: { value } }) => {
          setInvalid(value);
        },
        onValueChanged: ({ detail: { value } }) => {
          if (!(invalid || value === filterValue)) {
            updateFilter(matcher, value);
          }
        }
      }
    )
  ] });
}
function NoHeaderFilter() {
  return /* @__PURE__ */ jsx(Fragment, {});
}
export {
  BooleanHeaderFilter,
  DateHeaderFilter,
  EnumHeaderFilter,
  NoHeaderFilter,
  NumberHeaderFilter,
  StringHeaderFilter,
  TimeHeaderFilter
};
//# sourceMappingURL=header-filter.js.map
