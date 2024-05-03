function __REGISTER__(feature) {
  window.Vaadin ??= {};
  window.Vaadin.registrations ??= [];
  window.Vaadin.registrations.push({
    is: feature ? `${"@vaadin/hilla-react-crud"}/${feature}` : "@vaadin/hilla-react-crud",
    version: "24.4.0-beta1"
  });
}
export * from "./autogrid-feature.js";
export * from "./autoform-feature.js";
export * from "./autocrud-feature.js";
import { useDataProvider } from "./data-provider.js";
__REGISTER__();
export {
  useDataProvider
};
//# sourceMappingURL=index.js.map
