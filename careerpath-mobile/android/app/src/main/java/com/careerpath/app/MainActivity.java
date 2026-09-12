package com.careerpath.app;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Ensure root view applies system bar insets (status bar & camera cutouts)
        // so content is never drawn beneath or overlapping the status bar.
        View rootView = findViewById(android.R.id.content);
        if (rootView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(rootView, (view, insets) -> {
                int statusBarInset = insets.getInsets(
                    WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
                ).top;
                view.setPadding(0, statusBarInset, 0, 0);
                return insets;
            });
        }
    }
}
