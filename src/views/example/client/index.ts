import * as alt from "@altv/client";
import * as shared from "@altv/shared";

const KEY = shared.Enums.KeyCode.F2;

let webView: alt.WebView | undefined;

function showWebView() {
  if (webView) {
    webView.focused = false;
    alt.Cursor.visible = false;
    webView.destroy();
    webView = undefined;
    alt.setGameControlsActive(true);
  } else {
    alt.setGameControlsActive(false);
    webView = alt.WebView.create({ url: "http://resource/client/html/index.html" });
    webView.focused = true;
    alt.Cursor.visible = true;
  }
}

alt.Events.onKeyUp(({ key }) => {
  if (key === KEY) {
    showWebView();
  }
});
