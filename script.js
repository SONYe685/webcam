function onOpenCvReady() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.error("Webカメラのアクセスに失敗しました: ", err);
        });

    video.addEventListener('play', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
        const gray = new cv.Mat();
        const circles = new cv.Mat();

        function processFrame() {
            if (video.paused || video.ended) {
                return;
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            src.data.set(imageData.data);

            // グレースケールに変換
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

            // 瞳孔を検出
            cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT, 1, gray.rows / 8, 100, 30, 0, 0);

            // 検出された円を描画
            for (let i = 0; i < circles.cols; ++i) {
                let x = circles.data32F[i * 3];
                let y = circles.data32F[i * 3 + 1];
                let radius = circles.data32F[i * 3 + 2];
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // 次のフレームを処理
            requestAnimationFrame(processFrame);
        }

        // フレームの処理を開始
        processFrame();
    });
}
