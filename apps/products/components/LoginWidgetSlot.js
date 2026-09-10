import { useEffect, useRef } from "react";

// Mounts the login-widget bundle (window.LoginWidget, exposed by
// widget/index.jsx) into a plain container instead of a custom element.
// Handles rendering before the widget script (loaded via next/script)
// has finished executing, by also listening for its ready event.
export default function LoginWidgetSlot(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    function tryMount() {
      if (containerRef.current && window.LoginWidget) {
        window.LoginWidget.mount(containerRef.current, props);
      }
    }
    tryMount();
    window.addEventListener("sty:login-widget-ready", tryMount);
    return () => {
      window.removeEventListener("sty:login-widget-ready", tryMount);
      if (containerRef.current && window.LoginWidget) {
        window.LoginWidget.unmount(containerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
}
