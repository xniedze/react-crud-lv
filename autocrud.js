import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@hilla/react-components/Button.js";
import { SplitLayout } from "@hilla/react-components/SplitLayout.js";
import { useRef, useState } from "react";
import { AutoCrudDialog } from "./autocrud-dialog.js";
import css from "./autocrud.obj.js";
import { emptyItem, AutoForm } from "./autoform.js";
import { AutoGrid } from "./autogrid.js";
import { useMediaQuery } from "./media-query.js";
import { registerStylesheet } from "./util.js";
registerStylesheet(css);
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
  function refreshGrid() {
    autoGridRef.current?.refresh();
  }
  function handleCancel() {
    setItem(void 0);
  }
  const onSubmitCustom = formProps?.onSubmitSuccess;
  const onDeleteCustom = formProps?.onDeleteSuccess;
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
        ref: autoGridRef
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "auto-crud-toolbar", children: /* @__PURE__ */ jsx(Button, { theme: "primary", onClick: () => setItem(emptyItem), children: "+ Jauns" }) })
  ] });
  const autoForm = /* @__PURE__ */ jsx(
    AutoForm,
    {
      deleteButtonVisible: true,
      ...formProps,
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
        onSubmitCustom?.({ item: submittedItem });
      },
      onDeleteSuccess: (arg) => {
        setItem(void 0);
        refreshGrid();
        onDeleteCustom?.(arg);
      }
    }
  );
  return /* @__PURE__ */ jsx("div", { className: `auto-crud ${className ?? ""}`, id, style, children: fullScreen ? /* @__PURE__ */ jsxs(Fragment, { children: [
    mainSection,
    /* @__PURE__ */ jsx(AutoCrudDialog, { opened: !!item, onClose: handleCancel, children: autoForm })
  ] }) : /* @__PURE__ */ jsxs(SplitLayout, { theme: "small", children: [
    mainSection,
    autoForm
  ] }) });
}
export {
  AutoCrud
};
//# sourceMappingURL=autocrud.js.map
