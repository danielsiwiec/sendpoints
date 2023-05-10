import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const initalizeAnalytics = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCVTR0LgZQauCBPyRbt8DzfeShqwWhHOZQ",
        authDomain: "sendpoints-220301.firebaseapp.com",
        projectId: "sendpoints-220301",
        storageBucket: "sendpoints-220301.appspot.com",
        messagingSenderId: "238056017630",
        appId: "1:238056017630:web:b22d24c1660267d6373c4f",
        measurementId: "G-167DG9RQRQ"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    logEvent(analytics, 'page_view');
}

export default initalizeAnalytics;