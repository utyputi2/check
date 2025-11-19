// check_german_server.js
(function() {
    // const GERMAN_SERVER = "https://support1c.giftru.xyz"; // немецкий сервер
    
    const GERMAN_SERVER = "https://httpbin.org/delay/5";
    const RU_PROXY = "https://support1c-ru.giftru.xyz";   // русский прокси
    const TIMEOUT_MS = 3000; 
    const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 час

    // Если мы уже на русском прокси — не проверяем
    if (window.location.hostname === "support1c-ru.giftru.xyz") return;

    const lastCheck = localStorage.getItem("german_server_last_check");
    const lastOk = localStorage.getItem("german_server_ok");

    if (lastCheck && (Date.now() - parseInt(lastCheck, 10) < CHECK_INTERVAL_MS) && lastOk === "1") {
        return;
    }

    function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))
        ]);
    }

    fetchWithTimeout(GERMAN_SERVER + "/", { method: "HEAD", mode: "no-cors", cache: "no-store" })
        .then(() => {
            localStorage.setItem("german_server_ok", "1");
            localStorage.setItem("german_server_last_check", Date.now().toString());
        })
        .catch(() => {
            window.location.href = RU_PROXY + window.location.pathname + window.location.search;
        });
})();
