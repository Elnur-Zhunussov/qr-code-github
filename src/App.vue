<script>
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import QRCode from 'qrcode';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const REDIRECT_URL = 'https://google.com';

export default {
    setup() {
        const scanResult = ref(null);
        const qrCanvas = ref(null);
        const isScanning = ref(false);
        let scanner = null;

        const startScanning = async () => {
            isScanning.value = true;
            await nextTick();
            scanner = new Html5QrcodeScanner(
                'qr-reader',
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
                },
                false
            );
            scanner.render(
                (decodedText) => {
                    scanResult.value = decodedText;
                    try {
                        const url = new URL(decodedText);
                        if (url.protocol === 'https:' || url.protocol === 'http:') {
                            window.location.href = decodedText;
                        }
                    } catch {
                        // not a URL
                    }
                },
                () => {}
            );
        };

        const stopScanning = () => {
            if (scanner) {
                scanner.clear().catch(() => {});
                scanner = null;
            }
            isScanning.value = false;
            scanResult.value = null;
        };

        onMounted(async () => {
            await QRCode.toCanvas(qrCanvas.value, REDIRECT_URL, { width: 220 });
        });

        onBeforeUnmount(() => {
            if (scanner) {
                scanner.clear().catch(() => {});
            }
        });

        return { scanResult, qrCanvas, isScanning, startScanning, stopScanning, redirectUrl: REDIRECT_URL };
    }
};
</script>

<template>
    <div class="page">
        <h1 class="title">QR Code Test</h1>

        <div class="card">
            <h2>QR-код</h2>
            <p class="hint">Отсканируйте — перенаправит на <strong>{{ redirectUrl }}</strong></p>
            <div class="qr-wrap">
                <canvas ref="qrCanvas"></canvas>
            </div>
        </div>

        <div class="card">
            <h2>Сканер</h2>

            <div v-if="!isScanning" class="scan-idle">
                <p class="hint">Нажмите кнопку, чтобы открыть камеру</p>
                <button class="btn" @click="startScanning">📷 Сканировать</button>
            </div>

            <template v-else>
                <div id="qr-reader" class="reader"></div>
                <button class="btn btn-secondary mt" @click="stopScanning">✕ Закрыть</button>

                <div v-if="scanResult" class="result">
                    <p class="result-label">Результат:</p>
                    <p class="result-text">{{ scanResult }}</p>
                    <p class="result-hint">Перенаправление...</p>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
}

.page {
    max-width: 480px;
    margin: 0 auto;
    padding: 16px;
    font-family: system-ui, sans-serif;
}

.title {
    text-align: center;
    font-size: 1.4rem;
    margin-bottom: 16px;
    color: #1a1a1a;
}

.card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card h2 {
    font-size: 1.1rem;
    margin: 0 0 8px;
    color: #111827;
}

.hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 16px;
}

.qr-wrap {
    display: flex;
    justify-content: center;
}

.scan-idle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
}

.reader {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.btn {
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
}

.btn:active {
    background: #1d4ed8;
}

.btn-secondary {
    background: #6b7280;
    margin-top: 12px;
}

.btn-secondary:active {
    background: #4b5563;
}

.mt {
    margin-top: 12px;
}

.result {
    margin-top: 16px;
    padding: 16px;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 8px;
}

.result-label {
    font-weight: 600;
    color: #166534;
    margin: 0 0 4px;
}

.result-text {
    word-break: break-all;
    color: #15803d;
    margin: 0 0 4px;
}

.result-hint {
    font-size: 0.8rem;
    color: #4ade80;
    margin: 0;
}
</style>
