import { AutoForm as _AutoForm } from "./autoform.js";
import { featureRegistration } from "./util";
import { ModelInfo as _ModelInfo } from "./model-info.js";
export * from "./autoform.js";
export * from "./autoform-field.js";
export * from "./model-info.js";
const createModelInfo = (model, idPropertyName) => new _ModelInfo(model, idPropertyName);
const AutoForm = featureRegistration(_AutoForm, "AutoForm");
export {
  AutoForm,
  createModelInfo
};
//# sourceMappingURL=autoform-feature.js.map
