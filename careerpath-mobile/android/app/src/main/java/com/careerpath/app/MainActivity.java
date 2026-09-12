package com.careerpath.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // 1. Ensure status bar is drawn with the app's dark background color (#0e1014)
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.parseColor("#0e1014"));

        // 2. Status bar text and icons should be light/white on the dark status bar
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        if (controller != null) {
            controller.setAppearanceLightStatusBars(false);
        }

        // 3. Apply exact system status bar and cutout inset to the root content view,
        // so the WebView always starts directly below the status bar.
        // Also consume the insets so the internal webview doesn't apply duplicate CSS safe area insets.
        View rootView = findViewById(android.R.id.content);
        if (rootView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(rootView, (view, insets) -> {
                int statusBarInset = insets.getInsets(
                    WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
                ).top;
                int navBarInset = insets.getInsets(
                    WindowInsetsCompat.Type.navigationBars()
                ).bottom;
                view.setPadding(0, statusBarInset, 0, navBarInset);
                return WindowInsetsCompat.CONSUMED;
            });
        }
    }
}

