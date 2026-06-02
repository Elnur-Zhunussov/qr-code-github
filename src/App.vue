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
    <div id="qr-reader" style="width: 500px; margin: 0 auto;"></div>
    <div v-if="scanResult" style="text-align: center; margin-top: 16px; font-family: sans-serif;">
        Результат: <strong>{{ scanResult }}</strong>
    </div>
</template>
