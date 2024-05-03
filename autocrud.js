import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@vaadin/react-components/Button.js";
import { SplitLayout } from "@vaadin/react-components/SplitLayout.js";
import { useId, useRef, useState } from "react";
import { AutoCrudDialog } from "./autocrud-dialog.js";
import css from "./autocrud.obj.js";
import { emptyItem, AutoForm } from "./autoform.js";
import { AutoGrid } from "./autogrid.js";
import { useMediaQuery } from "./media-query.js";
import { registerStylesheet } from "./util.js";
registerStylesheet(css);
function defaultFormHeaderRenderer(editedItem, disabled) {
  const style = { color: disabled ? "var(--lumo-disabled-text-color)" : "var(--lumo-text-color)" };
  return editedItem ? /* @__PURE__ */ jsx("h3", { style, children: "Edit item" }) : /* @__PURE__ */ jsx("h3", { style, children: "New item" });
}
function AutoCrud({
  service,
  model,
  itemIdProperty,
  formProps,
  gridProps,
  style,
  id,
  className
}) {
  const [item, setItem] = useState(void 0);
  const fullScreen = useMediaQuery("(max-width: 600px), (max-height: 600px)");
  const autoGridRef = useRef(null);
  const { headerRenderer: customFormHeaderRenderer, ...autoFormProps } = formProps ?? {};
  const formHeaderRenderer = customFormHeaderRenderer ?? defaultFormHeaderRenderer;
  const autoCrudId = useId();
  function refreshGrid() {
    autoGridRef.current?.refresh();
  }
  function handleCancel() {
    setItem(void 0);
  }
  const formHeader = item && item !== emptyItem ? formHeaderRenderer(item, !item) : formHeaderRenderer(null, !item);
  const mainSection = /* @__PURE__ */ jsxs("div", { className: "auto-crud-main", children: [
    /* @__PURE__ */ jsx(
      AutoGrid,
      {
        ...gridProps,
        service,
        model,
        itemIdProperty,
        selectedItems: item && item !== emptyItem ? [item] : [],
        onActiveItemChanged: (e) => {
          const activeItem = e.detail.value;
          setItem(activeItem ?? void 0);
        },
        ref: autoGridRef,
        "aria-controls": autoFormProps.id ?? `auto-form-${id ?? autoCrudId}`
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "auto-crud-toolbar", children: /* @__PURE__ */ jsx(Button, { theme: "primary", onClick: () => setItem(emptyItem), children: "+ Jauns" }) })
  ] });
  const autoForm = /* @__PURE__ */ jsx(
    AutoForm,
    {
      id: autoFormProps.id ?? `auto-form-${id ?? autoCrudId}`,
      deleteButtonVisible: true,
      ...autoFormProps,
      disabled: !item,
      service,
      model,
      itemIdProperty,
      item,
      onSubmitSuccess: ({ item: submittedItem }) => {
        if (fullScreen) {
          setItem(void 0);
        } else {
          setItem(submittedItem);
        }
        refreshGrid();
      },
      onDeleteSuccess: () => {
        setItem(void 0);
        refreshGrid();
      }
    }
  );
  return /* @__PURE__ */ jsx("div", { className: `auto-crud ${className ?? ""}`, id, style, children: fullScreen ? /* @__PURE__ */ jsxs(Fragment, { children: [
    mainSection,
    /* @__PURE__ */ jsx(AutoCrudDialog, { opened: !!item, header: formHeader, onClose: handleCancel, children: autoForm })
  ] }) : /* @__PURE__ */ jsxs(SplitLayout, { theme: "small", children: [
    mainSection,
    /* @__PURE__ */ jsxs("div", { className: "auto-crud-form", children: [
      /* @__PURE__ */ jsx("div", { className: "auto-crud-form-header", children: formHeader }),
      autoForm
    ] })
  ] }) });
}
export {
  AutoCrud
};
//# sourceMappingURL=autocrud.js.map
