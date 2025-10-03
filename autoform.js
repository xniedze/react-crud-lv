import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ValidationError } from "@hilla/form";
import { EndpointError } from "@hilla/frontend";
import { Button } from "@hilla/react-components/Button.js";
import { ConfirmDialog } from "@hilla/react-components/ConfirmDialog";
import { FormLayout } from "@hilla/react-components/FormLayout";
import { VerticalLayout } from "@hilla/react-components/VerticalLayout.js";
import { useForm } from "@hilla/react-form";
import {
  useEffect,
  useMemo,
  useState
} from "react";
import { AutoFormField } from "./autoform-field.js";
import css from "./autoform.obj.js";
import { getDefaultProperties, ModelInfo } from "./model-info.js";
import { registerStylesheet } from "./util.js";
registerStylesheet(css);
const emptyItem = Symbol();
function AutoForm({
  service,
  model,
  itemIdProperty,
  item = emptyItem,
  onSubmitError,
  onSubmitSuccess,
  disabled,
  readonly,
  layoutRenderer: LayoutRenderer,
  visibleFields,
  formLayoutProps,
  fieldOptions,
  style,
  id,
  className,
  deleteButtonVisible,
  onDeleteSuccess,
  onDeleteError,
  submitOnEnter
}) {
  const form = useForm(model, {
    onSubmit: async (formItem) => service.save(formItem)
  });
  const [formError, setFormError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const modelInfo = useMemo(() => new ModelInfo(model, itemIdProperty), [model]);
  const isEditMode = item !== void 0 && item !== null && item !== emptyItem;
  const showDeleteButton = deleteButtonVisible && isEditMode && modelInfo.idProperty;
  const isSubmitDisabled = !!disabled || isEditMode && !form.dirty;
  useEffect(() => {
    if (item !== emptyItem) {
      form.read(item);
    } else {
      form.clear();
    }
  }, [item]);
  async function handleSubmit() {
    try {
      setFormError("");
      const newItem = await form.submit();
      if (newItem === void 0) {
        throw new EndpointError("No update performed");
      } else if (onSubmitSuccess) {
        onSubmitSuccess({ item: newItem });
      }
      if (!item || item === emptyItem) {
        form.clear();
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return;
      }
      if (error instanceof EndpointError) {
        if (onSubmitError) {
          onSubmitError({ error, setMessage: setFormError });
        } else {
          setFormError(error.message);
        }
      } else {
        throw error;
      }
    }
  }
  function deleteItem() {
    setShowDeleteDialog(true);
  }
  async function confirmDelete() {
    const deletedItem = item;
    try {
      const idProperty = modelInfo.idProperty;
      const id2 = item[idProperty.name];
      await service.delete(id2);
      if (onDeleteSuccess) {
        onDeleteSuccess({ item: deletedItem });
      }
    } catch (error) {
      if (error instanceof EndpointError) {
        if (onDeleteError) {
          onDeleteError({ error, setMessage: setFormError });
        } else {
          setFormError(error.message);
        }
      } else {
        throw error;
      }
    } finally {
      setShowDeleteDialog(false);
    }
  }
  function cancelDelete() {
    setShowDeleteDialog(false);
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isSubmitDisabled && submitOnEnter) {
      void handleSubmit();
    }
  };
  function createAutoFormField(propertyInfo) {
    const fieldOptionsForProperty = fieldOptions?.[propertyInfo.name] ?? {};
    return /* @__PURE__ */ jsx(
      AutoFormField,
      {
        propertyInfo,
        form,
        disabled,
        readonly,
        options: fieldOptionsForProperty
      },
      propertyInfo.name
    );
  }
  const visibleProperties = visibleFields ? modelInfo.getProperties(visibleFields) : getDefaultProperties(modelInfo);
  const fields = visibleProperties.map(createAutoFormField);
  const layout = LayoutRenderer ? /* @__PURE__ */ jsx(LayoutRenderer, { form, children: fields }) : /* @__PURE__ */ jsx(FormLayout, { ...formLayoutProps, children: fields });
  return /* @__PURE__ */ jsxs("div", { className: `auto-form ${className ?? ""}`, id, style, "data-testid": "auto-form", children: [
    /* @__PURE__ */ jsxs(VerticalLayout, { className: "auto-form-fields", onKeyDown: handleKeyDown, children: [
      layout,
      formError ? /* @__PURE__ */ jsx("div", { style: { color: "var(--lumo-error-color)" }, children: formError }) : /* @__PURE__ */ jsx(Fragment, {})
    ] }),
    !readonly && /* @__PURE__ */ jsxs("div", { className: "auto-form-toolbar", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          theme: "primary",
          disabled: isSubmitDisabled,
          onClick: handleSubmit,
          children: "Saglab\u0101t"
        }
      ),
      form.dirty ? /* @__PURE__ */ jsx(Button, { theme: "tertiary", onClick: () => form.reset(), children: "Atmest" }) : null,
      showDeleteButton && /* @__PURE__ */ jsx(Button, { className: "auto-form-delete-button", theme: "tertiary error", onClick: deleteItem, children: "Izdz\u0113st..." })
    ] }),
    showDeleteDialog && /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        opened: true,
        header: "Dz\u0113st ierakstu",
        confirmTheme: "error",
        cancelButtonVisible: true,
        onConfirm: confirmDelete,
        onCancel: cancelDelete,
        confirmText: "Apstiprin\u0101t",
        cancelText: "Atcelt",
        children: "Vai tie\u0161\u0101m izdz\u0113st izv\u0113l\u0113to ierakstu?"
      }
    )
  ] });
}
export {
  AutoForm,
  emptyItem
};
//# sourceMappingURL=autoform.js.map
