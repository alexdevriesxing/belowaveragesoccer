package com.fmcgbyalex.marketplacemargin

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.os.Environment
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import java.io.File

class MainActivity : Activity() {
    private lateinit var webView: WebView

    inner class FmcgBridge {
        @JavascriptInterface
        fun exportCsv(content: String) {
            try {
                val directory = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: filesDir
                directory.mkdirs()
                val file = File(directory, "fmcg-by-alex-marketplace-margin-analysis.csv")
                file.writeText(content, Charsets.UTF_8)
                runOnUiThread {
                    Toast.makeText(
                        this@MainActivity,
                        "CSV saved to ${file.absolutePath}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            } catch (error: Exception) {
                runOnUiThread {
                    Toast.makeText(
                        this@MainActivity,
                        "Could not save CSV: ${error.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled", "AddJavascriptInterface")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            settings.allowContentAccess = false
            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()
            addJavascriptInterface(FmcgBridge(), "FMCGAndroid")
        }

        setContentView(webView)

        if (savedInstanceState == null) {
            webView.loadUrl("file:///android_asset/index.html")
        } else {
            webView.restoreState(savedInstanceState)
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        webView.removeJavascriptInterface("FMCGAndroid")
        webView.destroy()
        super.onDestroy()
    }
}
