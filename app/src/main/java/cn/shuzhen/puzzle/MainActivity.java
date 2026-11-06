package cn.shuzhen.puzzle;

import android.app.Activity;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.window.OnBackInvokedDispatcher;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Locale;

/** An offline-only host. Assets use a stable HTTPS origin for modules and localStorage. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/www/index.html";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        int paper = Color.rgb(246, 244, 238);
        getWindow().setStatusBarColor(paper);
        getWindow().setNavigationBarColor(paper);
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        if (Build.VERSION.SDK_INT >= 29) {
            getWindow().setNavigationBarContrastEnforced(false);
        }
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
        }

        FrameLayout container = new FrameLayout(this);
        container.setBackgroundColor(paper);
        container.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets safe = insets.getInsets(
                    WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
            } else {
                // On older Android versions decor fitting already excludes system bars.
                view.setPadding(0, 0, 0, 0);
            }
            return insets;
        });

        webView = new WebView(this);
        webView.setBackgroundColor(paper);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        int textZoom = Math.round(getResources().getConfiguration().fontScale * 100);
        settings.setTextZoom(Math.max(85, Math.min(130, textZoom)));
        settings.setMediaPlaybackRequiresUserGesture(true);
        WebView.setWebContentsDebuggingEnabled(
            (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0);
        webView.setWebViewClient(new OfflineAssetClient());
        container.addView(webView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(container);
        container.requestApplyInsets();
        webView.loadUrl(START_URL);

        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
    }

    private void handleBack() {
        if (webView == null) {
            finish();
            return;
        }
        webView.evaluateJavascript(
            "(typeof window.onAndroidBack==='function') && Boolean(window.onAndroidBack())",
            handled -> { if (!"true".equals(handled)) finish(); });
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        handleBack();
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            webView.evaluateJavascript("window.dispatchEvent(new Event('pagehide'))", null);
            webView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    private final class OfflineAssetClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return !isLocal(request);
        }

        private boolean isLocal(WebResourceRequest request) {
            return "https".equals(request.getUrl().getScheme())
                && HOST.equals(request.getUrl().getHost())
                && request.getUrl().getPath() != null
                && request.getUrl().getPath().startsWith("/assets/www/");
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            if (!isLocal(request)) return notFound();
            String path = request.getUrl().getPath().substring("/assets/".length());
            if (path.contains("..") || path.contains("\\")) return notFound();
            try {
                InputStream stream = getAssets().open(path);
                return new WebResourceResponse(mimeType(path), "UTF-8", 200, "OK",
                    Collections.singletonMap("Cache-Control", "no-cache"), stream);
            } catch (IOException ignored) {
                return notFound();
            }
        }

        private WebResourceResponse notFound() {
            return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
                Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
        }

        private String mimeType(String path) {
            String name = path.toLowerCase(Locale.ROOT);
            if (name.endsWith(".html")) { return "text/html"; }
            if (name.endsWith(".js") || name.endsWith(".mjs")) { return "text/javascript"; }
            if (name.endsWith(".css")) { return "text/css"; }
            if (name.endsWith(".json")) { return "application/json"; }
            if (name.endsWith(".svg")) { return "image/svg+xml"; }
            if (name.endsWith(".png")) { return "image/png"; }
            if (name.endsWith(".webp")) { return "image/webp"; }
            if (name.endsWith(".woff2")) { return "font/woff2"; }
            return "application/octet-stream";
        }
    }
}
