import { useEffect, useRef } from "react";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

const Whiteboard = ({ elements, onLocalChange, excalidrawAPIRef }) => {
  
  const lastAppliedRef = useRef(null);

  
  useEffect(() => {
    if (excalidrawAPIRef.current && elements) {
      const serialized = JSON.stringify(elements);
      if (serialized === lastAppliedRef.current) {
        return;
      }
      lastAppliedRef.current = serialized;
      excalidrawAPIRef.current.updateScene({ elements });
    }
  }, [elements, excalidrawAPIRef]);

  const handleChange = (newElements) => {
    const serialized = JSON.stringify(newElements);
    if (serialized === lastAppliedRef.current) {
      return;
    }
    onLocalChange(newElements);
  };

  return (
    <div className="w-full h-full bg-surface-container-lowest devhive-whiteboard">
      <style>{`
  /* Force the neon accent — must be scoped to .excalidraw itself, not just
     the wrapper, because Excalidraw's own stylesheet sets --color-primary
     directly on this element and would otherwise win the cascade. */
  .devhive-whiteboard .excalidraw,
  .devhive-whiteboard .excalidraw.theme--dark {
    --color-primary: #00ffa3 !important;
    --color-primary-darker: #00e693 !important;
    --color-primary-darkest: #00cc84 !important;
    --color-primary-light: #00ffa333 !important;
  }

  /* hamburger "Main menu" button — top left three lines */
  .devhive-whiteboard .excalidraw button[aria-label="Main menu"],
  .devhive-whiteboard .excalidraw button[data-testid="main-menu-trigger"] {
    display: none !important;
  }

  /* library panel toggle — top right */
  .devhive-whiteboard .excalidraw button[aria-label="Show library"],
  .devhive-whiteboard .excalidraw button[aria-label="Library"],
  .devhive-whiteboard .excalidraw button[data-testid="library-button"] {
    display: none !important;
  }

  /* live-collaboration / share button */
  .devhive-whiteboard .excalidraw button[aria-label="Live collaboration"],
  .devhive-whiteboard .excalidraw button[aria-label="Share"] {
    display: none !important;
  }

  /* help / keyboard-shortcuts button — bottom right */
  .devhive-whiteboard .excalidraw button[aria-label="Help"],
  .devhive-whiteboard .excalidraw button[data-testid="help-icon"] {
    display: none !important;
  }

  /* bottom-left "Excalidraw" watermark/footer link */
  .devhive-whiteboard .excalidraw .layer-ui__wrapper__footer-left,
  .devhive-whiteboard .excalidraw .layer-ui__wrapper__footer-center {
    display: none !important;
  }

  /* soften corners to match DevHive's rounded surfaces */
  .devhive-whiteboard .excalidraw .App-toolbar,
  .devhive-whiteboard .excalidraw .panelColumn,
  .devhive-whiteboard .excalidraw .Island {
    border-radius: 10px !important;
  }
`}</style>

      <Excalidraw
        excalidrawAPI={(api) => (excalidrawAPIRef.current = api)}
        onChange={handleChange}
        theme="dark"
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: false,
            saveToActiveFile: false,
            saveAsImage: false,
            toggleTheme: false,
            clearCanvas: true,
            changeViewBackgroundColor: true,
          },
        }}
      >
    
        <MainMenu></MainMenu>
      </Excalidraw>
    </div>
  );
};

export default Whiteboard;