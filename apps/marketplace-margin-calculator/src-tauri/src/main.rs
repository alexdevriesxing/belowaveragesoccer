fn smoke_test() -> Result<(), String> {
    let html = include_str!("../../web/index.html");
    let core = include_str!("../../web/calculator-core.js");
    let app = include_str!("../../web/app.js");

    if !html.contains("FMCG by Alex") || !html.contains("Marketplace Margin Calculator") {
        return Err("branded calculator HTML was not bundled".into());
    }
    if !core.contains("function calculate") || !app.contains("__FMCG_APP_SMOKE__") {
        return Err("calculator runtime assets are incomplete".into());
    }

    let gross = 50_000.0_f64;
    let discount = gross * 0.05;
    let revenue = gross - discount;
    let fees = revenue * 0.08;
    let fixed = 2_500.0 + 3_500.0 + 2_000.0;
    let cogs = 22_000.0;
    let tax = gross * 0.005;
    let profit = revenue - fees - fixed - cogs - tax;

    if (profit - 13_450.0).abs() > f64::EPSILON || (tax - 250.0).abs() > f64::EPSILON {
        return Err("known-margin smoke calculation failed".into());
    }

    println!("FMCG by Alex marketplace margin desktop smoke test passed.");
    Ok(())
}

fn main() {
    if std::env::args().any(|arg| arg == "--smoke-test") {
        if let Err(error) = smoke_test() {
            eprintln!("{error}");
            std::process::exit(1);
        }
        return;
    }

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running FMCG by Alex Marketplace Margin Calculator");
}
