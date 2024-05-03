import {
  AutoGridBooleanRenderer,
  AutoGridDateRenderer,
  AutoGridDateTimeRenderer,
  AutoGridDecimalRenderer,
  AutoGridEnumRenderer,
  AutoGridIntegerRenderer,
  AutoGridJsonRenderer,
  AutoGridTimeRenderer
} from "./autogrid-renderers";
import {
  BooleanHeaderFilter,
  DateHeaderFilter,
  EnumHeaderFilter,
  NoHeaderFilter,
  NumberHeaderFilter,
  StringHeaderFilter,
  TimeHeaderFilter
} from "./header-filter";
function getTypeColumnOptions(propertyInfo) {
  switch (propertyInfo.type) {
    case "integer":
      return {
        autoWidth: true,
        textAlign: "end",
        flexGrow: 0,
        renderer: AutoGridIntegerRenderer,
        headerRenderer: NumberHeaderFilter
      };
    case "decimal":
      return {
        autoWidth: true,
        textAlign: "end",
        flexGrow: 0,
        renderer: AutoGridDecimalRenderer,
        headerRenderer: NumberHeaderFilter
      };
    case "boolean":
      return {
        autoWidth: true,
        textAlign: "end",
        flexGrow: 0,
        renderer: AutoGridBooleanRenderer,
        headerRenderer: BooleanHeaderFilter
      };
    case "date":
      return {
        autoWidth: true,
        textAlign: "end",
        flexGrow: 0,
        renderer: AutoGridDateRenderer,
        headerRenderer: DateHeaderFilter
      };
    case "time":
      return {
        autoWidth: true,
        textAlign: "end",
        flexGrow: 0,
        renderer: AutoGridTimeRenderer,
        headerRenderer: TimeHeaderFilter
      };
    case "datetime":
      return {
        autoWidth: true,
        textAlign: "end",
        flexGrow: 0,
        renderer: AutoGridDateTimeRenderer,
        headerRenderer: DateHeaderFilter
      };
    case "enum":
      return {
        autoWidth: true,
        renderer: AutoGridEnumRenderer,
        headerRenderer: EnumHeaderFilter
      };
    case "string":
      return {
        autoWidth: true,
        headerRenderer: StringHeaderFilter
      };
    case "object":
      return {
        autoWidth: true,
        renderer: AutoGridJsonRenderer,
        headerRenderer: NoHeaderFilter
      };
    default:
      return {
        autoWidth: true,
        headerRenderer: NoHeaderFilter
      };
  }
}
function getColumnOptions(propertyInfo, customColumnOptions) {
  const typeColumnOptions = getTypeColumnOptions(propertyInfo);
  const finalHeaderRenderer = customColumnOptions?.filterable === false ? NoHeaderFilter : typeColumnOptions.headerRenderer;
  const columnOptions = customColumnOptions ? { ...typeColumnOptions, ...customColumnOptions, headerRenderer: finalHeaderRenderer } : typeColumnOptions;
  if (!columnOptions.headerRenderer) {
    console.error(`No header renderer defined for column ${propertyInfo.name}`);
  }
  return columnOptions;
}
export {
  getColumnOptions
};
//# sourceMappingURL=autogrid-columns.js.map
