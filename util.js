function __REGISTER__(feature) {
  window.Vaadin ??= {};
  window.Vaadin.registrations ??= [];
  window.Vaadin.registrations.push({
    is: feature ? `${"@vaadin/hilla-react-crud"}/${feature}` : "@vaadin/hilla-react-crud",
    version: "24.4.0-beta1"
  });
}
import { jsx } from "react/jsx-runtime";
import React, { forwardRef } from "react";
function convertToTitleCase(inputString) {
  const stringWithSpaces = inputString.replace(/_/gu, " ");
  const words = stringWithSpaces.split(" ");
  const titleCaseWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return titleCaseWords.join(" ");
}
function registerStylesheet(stylesheet) {
  const css = Array.from(stylesheet.cssRules).map((rule) => rule.cssText).join("\n");
  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.prepend(styleTag);
}
const registeredFeatures = /* @__PURE__ */ new Set();
function useFeatureRegistration(feature) {
  if (registeredFeatures.has(feature)) {
    return;
  }
  registeredFeatures.add(feature);
  __REGISTER__(feature);
}
function featureRegistration(Component, feature) {
  return forwardRef((props, ref) => {
    useFeatureRegistration(feature);
    return /* @__PURE__ */ jsx(Component, { ...props, ref });
  });
}
function isFilterEmpty(filter) {
  if (filter["@type"] === "and" || filter["@type"] === "or") {
    if (filter.children.length === 0) {
      return true;
    }
    return filter.children.every((child) => isFilterEmpty(child));
  }
  if ("filterValue" in filter) {
    return filter.filterValue === "";
  }
  throw new Error(`Unknown filter type: ${"@type" in filter ? filter["@type"] : JSON.stringify(filter)} `);
}
export {
  convertToTitleCase,
  featureRegistration,
  isFilterEmpty,
  registerStylesheet
};
//# sourceMappingURL=util.js.map
