/*
 * =========================================================
 * ZENVERIX — SUPABASE CONFIG
 * =========================================================
 */

const CONFIG = {
    SUPABASE_URL:
        "https://mpdyazgsnlfufdtzhleh.supabase.co",

    SUPABASE_PUBLISHABLE_KEY:
        "sb_publishable_BMsOWM_0_2jo-0Bw5OU1iQ_xTYiB4a1"
};


/*
 * =========================================================
 * SUPABASE CLIENT
 * =========================================================
 */

const supabaseClient = window.supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);


/*
 * =========================================================
 * CONNECTION TEST
 * =========================================================
 */

console.log(
    "Zenverix Supabase client initialized:",
    supabaseClient
);