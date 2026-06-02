<script>
import { Html5QrcodeScanner } from 'html5-qrcode';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

export default {
    setup() {
        const scanResult = ref(null);
        let scanner = null;

        onMounted(async () => {
            await nextTick();
            scanner = new Html5QrcodeScanner(
                'qr-reader',
                { fps: 10, qrbox: 250 },
                false
            );
            scanner.render(
                (decodedText) => {
                    scanResult.value = decodedText;
                    scanner.clear().catch(() => {});
                    scanner = null;
                },
                () => {}
            );
        });

        onBeforeUnmount(() => {
            if (scanner) scanner.clear().catch(() => {});
        });

        return { scanResult };
    }
};
</script>

<template>
    <div class="page">
        <div class="card">
            <h1 class="title">QR Сканер</h1>
            <div id="qr-reader"></div>
            <div v-if="scanResult" class="result">
                <span class="result-label">Результат:</span>
                <span class="result-text">{{ scanResult }}</span>
            </div>
        </div>
    </div>
</template>

<style>
body {
    margin: 0;
    background: #f3f4f6;
    font-family: 'Inter', system-ui, sans-serif;
}
</style>

<style scoped>
.page {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 32px 16px;
    box-sizing: border-box;
}

.card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    padding: 28px 24px;
    width: 100%;
    max-width: 520px;
}

.title {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 20px;
}

.result {
    margin-top: 20px;
    padding: 14px 16px;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.result-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #166534;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.result-text {
    font-size: 0.95rem;
    color: #15803d;
    word-break: break-all;
}
</style>
